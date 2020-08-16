/* eslint-disable */
async function ajax(path, data, callback) {
  const url = path;
  const requestData = JSON.stringify(data);
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: requestData,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.headers);
    callback(response, response.headers);
  } catch (error) {
    callback(`Error: ${error}`);
  }
}
