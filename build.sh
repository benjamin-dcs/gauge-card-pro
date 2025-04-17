DARKGRAY='\033[1;30m'
RED='\033[0;31m'
NC='\033[0m' # No Color

clear

echo -e "${RED}###${DARKGRAY} FORMATTING ${RED}###${NC}"
npm run format
echo ""
echo -e "${RED}###${DARKGRAY} INSTALLING ${RED}###${NC}"
npm install
echo ""
echo -e "${RED}###${DARKGRAY} CHECKING UNUSED DEPENDENCIES ${RED}###${NC}"
npm run depcheck
echo ""
echo -e "${RED}###${DARKGRAY} BUILDING ${RED}###${NC}"
npm run build
echo ""
echo -e "${RED}###${DARKGRAY} COPYING TO .hass_dev ${RED}###${NC}"
cp dist/gauge-card-pro.js .hass_dev/www/gauge-card-pro