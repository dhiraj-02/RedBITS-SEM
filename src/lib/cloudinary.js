

export const uploadToCloud = async (file) => {

    console.log(file)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'yn2ogg6g'); // Replace with your upload preset

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dnp6grooa/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data)
    return {fileUrl: data.secure_url}
    } catch (error) {
      console.error('Error uploading to Cloudinary', error);
    }

}

