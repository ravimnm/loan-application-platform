import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'http://localhost:8080';
const ADMIN_TOKEN = __ENV.ADMIN_TOKEN;
const APPLICATION_ID = 3;

export const options = {
    scenarios: {
        concurrent_approval: {
            executor: 'shared-iterations',
            vus: 100,
            iterations: 100,
            maxDuration: '30s',
        },
    },
};

export default function () {

    const response = http.post(
        `${BASE_URL}/api/admin/applications/${APPLICATION_ID}/approve`,
        null,
        {
            headers: {
                Authorization: `Bearer ${ADMIN_TOKEN}`,
            },
        }
    );

    console.log(`HTTP ${response.status}`);

    check(response, {
        'business response received': (r) =>
            r.status === 200 ||
            r.status === 400 ||
            r.status === 409 ||
            r.status === 500,
    });
}