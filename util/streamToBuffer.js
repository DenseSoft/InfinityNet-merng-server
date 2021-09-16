module.exports = async function streamToBuffer (stream) {
  const chunks = [];

  for await (let chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  const buffer  = Buffer.concat(chunks);

  return buffer;
}