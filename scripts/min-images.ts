import util from "util";
import path from "path";
import fs from "graceful-fs";
import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";

const makeDir = require('make-dir');

const writeFile = util.promisify(fs.writeFile);

const srcdir = "images";
const distdir = ".";

imagemin([srcdir + "/**/*.{jpg,jpeg,png}"], {
  plugins: [
    imageminJpegtran(),
    imageminPngquant({
      quality: [0.6, 0.8],
    }),
  ],
}).then((files) =>
  files.forEach(async (v) => {
    let source = path.parse(v.sourcePath);
    v.destinationPath = `${source.dir.replace(srcdir, distdir)}/${source.name}${
      source.ext
    }`;
    await makeDir(path.dirname(v.destinationPath));
    await writeFile(v.destinationPath, v.data);
  }),
).catch((err) => {
  console.error(err);
});
