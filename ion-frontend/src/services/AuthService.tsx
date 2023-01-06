import axios from 'axios';
import {cfg} from "../Root";

class SignupService {
    submitIdentity(identity: Object) {
        return axios.post(cfg.requestUrl+'/auth/api/user/create', identity);
    }
    preflight(id: string) {
        return axios.post(cfg.requestUrl+'/auth/api/user/id-preflight', id, {
            headers: {
                'content-type': 'text/plain'
            }
        });
    }
}

export default new SignupService();