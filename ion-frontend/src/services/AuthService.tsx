import axios from 'axios';

class SignupService {
    submitIdentity(identity: Object) {
        return axios.post('http://localhost:8080/auth/api/user/create', identity);
    }
}

export default new SignupService();