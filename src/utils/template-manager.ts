import { UnsubscribeFunc } from "home-assistant-js-websocket";
import { PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import hash from "object-hash/dist/object_hash";
import {
  HomeAssistant,
  RenderTemplateResult,
  subscribeRenderTemplate,
} from "../ha";
import { CacheManager } from "../mushroom/utils/cache-manager";

export class TemplateManager<TemplateKeys extends readonly string[]> {

  @property({ attribute: false }) private _hass?: HomeAssistant | undefined;
  @property({ attribute: false }) private _config?;
  @property({ attribute: false }) private _templateKeys?: TemplateKeys ;

  constructor(
      hass: HomeAssistant, 
      config,
      templateKeys: TemplateKeys
    ) {

    this._hass = hass;
    this._config = config;
    this._templateKeys = templateKeys;

    type TemplateResults = Partial<
      Record<TemplateKeys[number], RenderTemplateResult | undefined>
    >;
    this.templateCache = new CacheManager<TemplateResults>(1000);
  }
  
  @property({ attribute: false }) private _templateResults?;
  @property({ attribute: false }) private templateCache;

  @state() private _unsubRenderTemplates: Map<
    TemplateKeys[number],
    Promise<UnsubscribeFunc>
  > = new Map();

  public connectedCallback() {
    this.tryConnect();
  }

  private _computeCacheKey() {
    return hash(this._config);
  }

  public disconnectedCallback() {
    this.tryDisconnect();

    if (this._config && this._templateResults) {
      const key = this._computeCacheKey();
      this.templateCache.set(key, this._templateResults);
    }
  }

  public willUpdate(_changedProperties: PropertyValues): void {
    if (!this._config) {
      return;
    }

    if (!this._templateResults) {
      const key = this._computeCacheKey();
      if (this.templateCache.has(key)) {
        this._templateResults = this.templateCache.get(key)!;
      } else {
        this._templateResults = {};
      }
    }
  }

  public isTemplate(key: TemplateKeys[number]) {
    const value = this._config?.[key];
    return String(value)?.includes("{");
  }

  public getValue(key: TemplateKeys[number]) {
    return this.isTemplate(key)
      ? this._templateResults?.[key]?.result
      : this._config?.[key];
  }

  public async tryConnect(): Promise<void> {
    this._templateKeys!.forEach((key) => {
      this._tryConnectKey(key);
    });
  }

  private async _tryConnectKey(key: TemplateKeys[number]): Promise<void> {
    if (
      this._unsubRenderTemplates.get(key) !== undefined ||
      !this._hass ||
      !this._config ||
      !this.isTemplate(key)
    ) {
      return;
    }

    try {
      const sub = subscribeRenderTemplate(
        this._hass.connection,
        (result) => {
          this._templateResults = {
            ...this._templateResults,
            [key]: result,
          };
        },
        {
          template: String(this._config[key]) ?? "",
          entity_ids: this._config.entity_id,
          variables: {
            config: this._config,
            user: this._hass.user!.name,
            entity: this._config.entity,
          },
          strict: true,
        }
      );
      this._unsubRenderTemplates.set(key, sub);
      await sub;
    } catch (_err) {
      const result = {
        result: this._config[key] ?? "",
        listeners: {
          all: false,
          domains: [],
          entities: [],
          time: false,
        },
      };
      this._templateResults = {
        ...this._templateResults,
        [key]: result,
      };
      this._unsubRenderTemplates.delete(key);
    }
  }
  
  public async tryDisconnect(): Promise<void> {
    this._templateKeys!.forEach((key) => {
      this.tryDisconnectKey(key);
    });
  }

  public async tryDisconnectKey(key: TemplateKeys[number]): Promise<void> {
    const unsubRenderTemplate = this._unsubRenderTemplates.get(key);
    if (!unsubRenderTemplate) {
      return;
    }

    try {
      const unsub = await unsubRenderTemplate;
      unsub();
      this._unsubRenderTemplates.delete(key);
    } catch (err: any) {
      if (err.code === "not_found" || err.code === "template_error") {
        // If we get here, the connection was probably already closed. Ignore.
      } else {
        throw err;
      }
    }
  }
}
