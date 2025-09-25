echo_time() {
  date +"[%Y-%m-%d_%H:%M] $(printf "%s " "$@" | sed 's/%/%%/g')"
}

git clean -df
git checkout .
git fetch --all --prune

latestTag=$(git describe --tags `git rev-list --tags --max-count=1`)

echo_time "getting latest update"
echo_time "latest Tag : "$latestTag

git pull origin main

pnpm install --shamefully-hoist --force

pnpm run build

echo_time "Install sitemap.xml"
# python3 /home/reservation-atlas/sitemap-generator.py

echo "restarting service"
# sudo systemctl restart livechat-hwgroup.service
pm2 restart all
echo "restarted service"
