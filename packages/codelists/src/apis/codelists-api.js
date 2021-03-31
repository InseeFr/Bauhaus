import { API } from 'bauhaus-utilities';

const api = {
    getMutualizedComponents: () => ['components'],

    getMutualizedComponent: (id) => ['components/' + id],
    
};

export default API.buildApi('codeList', api);
