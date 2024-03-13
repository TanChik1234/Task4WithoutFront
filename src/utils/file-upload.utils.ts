import { extname } from "path";
import { HttpException, HttpStatus } from "@nestjs/common"

/**
 * Method for filtering incoming files, allowing only images to pass through.
 * @param req  the user's request
 * @param file the uploaded file
 * @param callback the callback function
 * @returns the callback function is invoked
 */
export const imageFileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
    console.log(file.originalname);
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
}

/**
 * Method for editing the image name for its storage on the server.
 * @param req the user's request with the file
 * @param file  the uploaded file (image)
 * @param callback the callback function
 */
export const editFileName = (req: Express.Request, file: Express.Multer.File, callback:Function) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random()*10).toString(10))
      .join('');
  callback(null, `${name}${randomName}${fileExtName}`)
}