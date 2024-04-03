export interface GDriveFile {
  kind: string;
  mimeType: string;
  id: string;
  name: string;
}

export interface GDriveFileGet {
  result: boolean;
  body: string;
  headers: Headers;
  status: number;
  statusText: null;
}

export interface Headers {
  "cache-control": string;
  "content-encoding": string;
  "content-type": string;
  date: string;
  expires: string;
  server: string;
  vary: string;
  "x-guploader-uploadid": string;
  "Content-Type": string;
}


export class GDriveUtil {
  public static async getFirstFileByName(fileName: string): Promise<GDriveFile | undefined> {
    const { result } = await gapi.client.drive.files.list({ q: `fullText contains '"${fileName}"'`, });

    // @ts-ignore
    const files = result?.files;

    return files && files[0];
  }

  public static async getFileById(fileId: string): Promise<GDriveFileGet | undefined> {
    return gapi.client.drive.files.get({ fileId: fileId, alt: 'media' } as any) as any;
  }

  public static createFile(name: string, data: any) {
    return new Promise((resolve, reject) => {
      try {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        const contentType = 'application/json';

        var metadata = {
          'name': name,
          'mimeType': contentType
        };

        var multipartRequestBody =
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: ' + contentType + '\r\n\r\n' +
          data +
          close_delim;

        var request = gapi.client.request({
          'path': '/upload/drive/v3/files',
          'method': 'POST',
          'params': { 'uploadType': 'multipart' },
          'headers': {
            'Content-Type': 'multipart/related; boundary="' + boundary + '"'
          },
          'body': multipartRequestBody
        });

        request.execute(resolve);
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public static updateFile(fileId: string, fileData: any) {
    // const url = 'https://www.googleapis.com/upload/drive/v3/files/' + fileId + '?uploadType=media';
    const boundary = '-------314159265358979323846';

    return new Promise((resolve, reject) => {
      const request = gapi.client.request({
        'path': '/upload/drive/v3/files/' + fileId + '?uploadType=media',
        'method': 'PATCH',
        'params': { 'uploadType': 'multipart', 'alt': 'json' },
        'headers': {
          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': fileData
      });

      request.then(resolve, reject)
      request.execute(resolve);
    });
    // fetch(url, {
    //   method: 'PATCH',
    //   headers: new Headers({
    //     Authorization: 'Bearer ' + oauthToken,
    //     'Content-type': 'application/my.app'
    //   }),
    //   body: fileData
    // })
    //   .then(result => result.json())
    //   .then(value => {
    //     console.log('Updated. Result:\n' + JSON.stringify(value, null, 2));
    //   })
    //   .catch(err => console.error(err))
  }

  /**
   * Update an existing file's metadata and content.
  *
  * @param {String} fileId ID of the file to update.
  * @param {Object} fileMetadata existing Drive file's metadata.
  * @param {File} fileData File object to read data from.
  * @param {Function} callback Callback function to call when the request is complete.
  */
  public static updateFile_OLD(fileId: string, fileMetadata: any, fileData: Blob): Promise<any> {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsBinaryString(fileData);
      reader.onload = function (err) {
        if (!err)
          return reject(err);

        try {
          var contentType = fileData.type || 'application/octet-stream';
          // Updating the metadata is optional and you can instead use the value from drive.files.get.
          var base64Data = btoa(reader.result as any);
          var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(fileMetadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;

          var request = gapi.client.request({
            'path': '/upload/drive/v2/files/' + fileId,
            'method': 'PUT',
            'params': { 'uploadType': 'multipart', 'alt': 'json' },
            'headers': {
              'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody
          });

          request.execute(resolve);
        } catch (ex) {
          reject(ex);
        }
      }
    });
  }
}