DARKGRAY='\033[1;30m'
RED='\033[0;31m'
NC='\033[0m' # No Color

ON_WHITE='\033[47m' 

clear

if [ "$1" != "--noinstall" ]; then
    echo "${RED}${ON_WHITE}###${DARKGRAY} INSTALLING ${RED}${ON_WHITE}###${NC}"
    npm install
    echo ""
    echo "${RED}${ON_WHITE}###${DARKGRAY} CHECKING UNUSED DEPENDENCIES ${RED}${ON_WHITE}###${NC}"
    npm run depcheck
    echo ""
fi

echo "${RED}${ON_WHITE}###${DARKGRAY} FORMATTING ${RED}${ON_WHITE}###${NC}"
npm run format
echo ""

echo "${RED}${ON_WHITE}###${DARKGRAY} TYPE CHECKING ${RED}${ON_WHITE}###${NC}"
npm run typecheck
echo ""

echo "${RED}${ON_WHITE}###${DARKGRAY} TESTING ${RED}${ON_WHITE}###${NC}"
npm run test