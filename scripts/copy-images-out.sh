# This script is used to copy files out initially
rm -rf ./dest
rsync -zarv --include="*/" --include="*.png" --include="*.jpg" --exclude="*" "./src" "./images"
rsync -zarv --include="*/" --include="*.png" --include="*.jpg" --exclude="*" "./android" "./images"
rsync -zarv --include="*/" --include="*.png" --include="*.jpg" --exclude="*" "./ios" "./images"
find src ios android -name "*.png" -exec rm {} \;
find src ios android -name "*.jpg" -exec rm {} \;
