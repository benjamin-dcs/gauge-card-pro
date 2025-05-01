DARKGRAY='\033[1;30m'
RED='\033[0;31m'
NC='\033[0m' # No Color

ON_WHITE='\033[47m' 

clear

echo -e "${RED}${ON_WHITE}###${DARKGRAY} FORMATTING ${RED}${ON_WHITE}###${NC}"
npm run format
echo ""

if [ "$1" != "--quick" ] && [ "$1" != "--format" ]; then
    echo -e "${RED}${ON_WHITE}###${DARKGRAY} INSTALLING ${RED}${ON_WHITE}###${NC}"
    npm install
    echo ""
    echo -e "${RED}${ON_WHITE}###${DARKGRAY} CHECKING UNUSED DEPENDENCIES ${RED}${ON_WHITE}###${NC}"
    npm run depcheck
    echo ""
fi

echo -e "${RED}${ON_WHITE}###${DARKGRAY} TESTING ${RED}${ON_WHITE}###${NC}"
npm run test
echo ""

if [ "$1" != "--format" ]; then
    echo -e "${RED}${ON_WHITE}###${DARKGRAY} BUILDING ${RED}${ON_WHITE}###${NC}"
    npm run build
    echo ""
    echo -e "${RED}${ON_WHITE}###${DARKGRAY} COPYING TO .hass_dev ${RED}${ON_WHITE}###${NC}"
    cp dist/gauge-card-pro.js .hass_dev/www/gauge-card-pro
    echo "Copy done ..."
fi