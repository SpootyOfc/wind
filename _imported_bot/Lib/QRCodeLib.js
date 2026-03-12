class qrGenerator {
    constructor({ imagePath }) {
        this.imagePath = imagePath;
    }

    generate = async function (data) {
        return await getRawData(data);
    }
}

async function getRawData(data) {
    try {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=464x464&data=${encodeURIComponent(data)}`;
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();

        return {
            status: 'success',
            response: Buffer.from(arrayBuffer).toString('base64')
        };
    } catch (e) {
        return {
            status: 'error',
            response: e
        };
    }
}

module.exports.qrGenerator = qrGenerator;
