import FileSaver from 'file-saver';

const CONTENT_DISPOSITION_FILENAME_REGEXP =
	/filename[^;\n=]*="((['"]).*?\2|[^;\n]*)"/;

export const getContentDisposition = (disposition) => {
	return disposition.match(CONTENT_DISPOSITION_FILENAME_REGEXP)[1];
};

export const saveFileFromHttpResponse = (response) => {
	response.headers.forEach(console.log);
	const fileName = getContentDisposition(
		response.headers.get('Content-Disposition')
	);

	return response.blob().then((blob) => saveFileToDisk(blob, fileName));
};

export const saveFileToDisk = (blob, fileName) =>
	FileSaver.saveAs(blob, fileName);
