import FileSaver from "file-saver";

const CONTENT_DISPOSITION_FILENAME_REGEXP = /filename[^;\n=]*="((['"]).*?\2|[^;\n]*)"/;

export const saveFileFromHttpResponse = (response: Response) => {
  const contentDisposition = response.headers.get("Content-Disposition");

  if (contentDisposition === null) {
    console.error("Unable to download the File due to a missing Content-Disposition header");
    return Promise.reject();
  }

  const matches = contentDisposition.match(CONTENT_DISPOSITION_FILENAME_REGEXP);

  if (matches === null) {
    console.error("Unable to parse the Content-Disposition header");
    return Promise.reject();
  }

  const fileName = matches[1];

  return response.blob().then((blob) => FileSaver.saveAs(blob, fileName));
};
