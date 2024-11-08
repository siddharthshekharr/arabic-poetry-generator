export async function generatePoem(data) {
    try {
        const response = await fetch('/api/poems/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to generate poem');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function fixPoem(poem) {
    try {
        const response = await fetch('/api/poems/fix', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ poem })
        });

        if (!response.ok) {
            throw new Error('Failed to fix poem');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}