import FileSaver from "file-saver";

const CONTENT_DISPOSITION_FILENAME_REGEXP = /filename[^;\n=]*="((['"]).*?\2|[^;\n]*)"/;

/**
 * Échec d'enregistrement d'un fichier reçu du serveur. Le `code` est traduit par le catalogue
 * global (`errors.fileDownloadFailed`) ; le `message`, en anglais, sert au journal.
 */
export class FileDownloadError extends Error {
  readonly code = "fileDownloadFailed";
}

export const saveFileFromHttpResponse = (response: Response) => {
  const contentDisposition = response.headers.get("Content-Disposition");

  if (contentDisposition === null) {
    return Promise.reject(
      new FileDownloadError(
        "Unable to download the File due to a missing Content-Disposition header",
      ),
    );
  }

  const matches = contentDisposition.match(CONTENT_DISPOSITION_FILENAME_REGEXP);

  if (matches === null) {
    return Promise.reject(new FileDownloadError("Unable to parse the Content-Disposition header"));
  }

  const fileName = matches[1];

  return response.blob().then((blob) => FileSaver.saveAs(blob, fileName));
};
