const { Storage } = require('@google-cloud/storage')

const projectId = 'inner-grove-221611'
const keyFilename = 'keyFilename.json'
const bucketName = 'appsstorage'
const fileName = './teste.txt'
const fileToUpload = './image.png'

const storage = new Storage({
  projectId,
  keyFilename
})

async function listBuckets() {
  const [buckets] = await storage.getBuckets();
  console.log('Buckets:');
  buckets.forEach(bucket => {
    console.log(bucket.name);
  });
}
// listBuckets()

async function listFiles(bucketName) {
  const [files] = await storage.bucket(bucketName).getFiles();

  console.log('Files:');
  files.forEach(file => {
    console.log(file.name);
  });
}
// listFiles(bucketName)

async function uploadFile(bucketName, filename) {
  await storage.bucket(bucketName).upload(filename, {
    gzip: true,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });

  console.log(`${filename} uploaded to ${bucketName}.`);
}
uploadFile(bucketName, fileToUpload)

async function makePublic(bucketName, filename) {
  await storage
    .bucket(bucketName)
    .file(filename)
    .makePublic();

  console.log(`gs://${bucketName}/${filename} is now public.`);
  console.log(`https://storage.googleapis.com/appsstorage/${filename}`)
}
makePublic(bucketName, 'image.png')

async function generateSignedUrl(bucketName, filename) {
  const options = {
    action: 'read',
    expires: Date.now() + 1000 * 60 * 60, // one hour
  };

  const [url] = await storage
    .bucket(bucketName)
    .file(filename)
    .getPublicUrl()
    .getSignedUrl(options);

  console.log(`The signed url for ${filename} is ${url}.`);
}
// generateSignedUrl(bucketName, 'teste.txt')