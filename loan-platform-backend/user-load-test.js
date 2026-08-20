import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'http://localhost:8080';
const ADMIN_TOKEN = __ENV.ADMIN_TOKEN;

export const options = {
    stages: [
        { duration: '30s', target: 100 },
        { duration: '30s', target: 250 },
        { duration: '30s', target: 500 },
        { duration: '30s', target: 1000 },
        { duration: '60s', target: 1000 },
        { duration: '30s', target: 0 }
    ],

    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<1000'],
    },
};

export default function () {

    const params = {
        headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json',
        },
        tags: {
            endpoint: 'application-by-id',
        },
    };

    const response = http.get(
        `${BASE_URL}/api/admin/applications/4`,
        params
    );

    check(response, {
        'status is 200': (r) => r.status === 200,
    });
}
