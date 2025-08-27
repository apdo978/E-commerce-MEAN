// Avatar Upload Test File
// This file demonstrates how to test the avatar upload functionality

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000/api/v1';

// Example test functions (these would need actual JWT token and image file)

// 1. Upload Avatar Test
async function testUploadAvatar(token, imagePath) {
    try {
        const formData = new FormData();
        formData.append('avatar', fs.createReadStream(imagePath));

        const response = await axios.post(`${BASE_URL}/users/avatar`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...formData.getHeaders()
            }
        });

        console.log('Upload Avatar Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Upload Avatar Error:', error.response?.data || error.message);
        throw error;
    }
}

// 2. Get Current User Avatar Test
async function testGetAvatar(token) {
    try {
        const response = await axios.get(`${BASE_URL}/users/avatar`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Get Avatar Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Get Avatar Error:', error.response?.data || error.message);
        throw error;
    }
}

// 3. Get User Avatar by ID Test (Public)
async function testGetUserAvatar(userId) {
    try {
        const response = await axios.get(`${BASE_URL}/users/avatar/${userId}`);

        console.log('Get User Avatar Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Get User Avatar Error:', error.response?.data || error.message);
        throw error;
    }
}

// 4. Delete Avatar Test
async function testDeleteAvatar(token) {
    try {
        const response = await axios.delete(`${BASE_URL}/users/avatar`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Delete Avatar Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Delete Avatar Error:', error.response?.data || error.message);
        throw error;
    }
}

// Example usage (commented out as it requires actual tokens and files)
/*
async function runTests() {
    const token = 'your-jwt-token-here';
    const imagePath = './path-to-test-image.jpg';
    const userId = 'user-id-here';

    try {
        // Test upload
        await testUploadAvatar(token, imagePath);
        
        // Test get current user avatar
        await testGetAvatar(token);
        
        // Test get user avatar by ID
        await testGetUserAvatar(userId);
        
        // Test delete avatar
        await testDeleteAvatar(token);
        
        console.log('All tests completed successfully!');
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

// Uncomment to run tests
// runTests();
*/

module.exports = {
    testUploadAvatar,
    testGetAvatar,
    testGetUserAvatar,
    testDeleteAvatar
};
