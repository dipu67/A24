const {storage} = require('./firebase')
const {ref,uploadBytes,getDownloadURL} = require('firebase/storage')


async function downloadFile(){
    const storageRef = ref(storage,"notcoin.jpg")
    const url = await getDownloadURL(storageRef)
    console.log(url);
}

module.exports = downloadFile