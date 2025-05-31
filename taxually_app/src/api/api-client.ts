import {ExtensionContextValue} from "@stripe/ui-extension-sdk/context";
import fetchStripeSignature from "@stripe/ui-extension-sdk/signature";
import {getFileNameFromContentDisposition} from "../utils/global-utils";

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export class ApiClient {
    private baseUrl: string;
    private userContext: ExtensionContextValue["userContext"];

    constructor(baseUrl: string | undefined, userContext: ExtensionContextValue["userContext"]) {
        if (!baseUrl) {
            throw new ApiError(500, 'API base URL is not defined');
        }
        this.baseUrl = baseUrl;
        this.userContext = userContext;
    }

    private async getHeaders(): Promise<HeadersInit> {
        try {
            const stripeSignature = await fetchStripeSignature();
            const signaturePayload = {
                user_id: this.userContext.id,
                account_id: this.userContext.account.id,
            };

            return {
                'Content-Type': 'application/json',
                'Stripe-Signature': stripeSignature,
                'Stripe-Signature-Payload': JSON.stringify(signaturePayload)
            };
        } catch (error) {
            console.error('Error fetching Stripe signature:', error);
            throw new ApiError(500, 'Failed to fetch Stripe signature');
        }
    }

    async getDownload(endpoint: string): Promise<any> {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'GET',
                headers,
            });

            return this.handleFileResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    async get(endpoint: string): Promise<any> {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'GET',
                headers,
            });

            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    async post(endpoint: string, body: any): Promise<any> {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });
            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    async patch(endpoint: string, body: any): Promise<any> {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(body),
            });
            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    async put(endpoint: string, body: any): Promise<any> {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(body),
            });
            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    async delete(endpoint: string): Promise<any> {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE',
                headers,
            });
            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    private async handleResponse(response: Response): Promise<any> {
        if (!response.ok) {
            let errorMessage = 'API request failed';
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } else {
                    errorMessage = await response.text() || errorMessage;
                }
            } catch (parseError) {
                console.error('Error parsing error response:', parseError);
            }
            throw new ApiError(response.status, errorMessage);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            // Check if there's actually content to parse
            const text = await response.text();
            return text ? JSON.parse(text) : null;
        } else if (response.status === 204) {
            // No Content
            return null;
        } else {
            // For non-JSON responses, return the raw text
            return response.text();
        }
    }

    private async handleFileResponse(response: Response): Promise<any> {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Extract file name from Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
        const fileName = contentDisposition
            ? getFileNameFromContentDisposition(contentDisposition)
            : 'documents.zip';

        // Convert the response to a blob
        const blob = await response.blob();

        // Create a link element
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;

        // Append the link to the body (it needs to be in the DOM to work)
        document.body.appendChild(link);

        // Programmatically click the link to trigger the download
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    private handleError(error: unknown): never {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, 'An unexpected error occurred');
    }

}

export const createApiClient = (userContext: ExtensionContextValue["userContext"],
                                environment: ExtensionContextValue["environment"]): ApiClient => {
    let backendApiUrl;

    if (environment.mode === 'test') {
        backendApiUrl = environment.constants ? environment.constants.BACKEND_API_URL_TEST||'' : ''
    } else {
        backendApiUrl = environment.constants ? environment.constants.BACKEND_API_URL_LIVE||'' : ''
    }

    return new ApiClient(backendApiUrl + '/api/v1', userContext);
};
