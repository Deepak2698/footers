export const uploadImages = (req, res) => {
  const files = req.files || (req.file ? [req.file] : []);
  const host = req.get('host');
  const protocol = req.protocol;

  const images = files.map((f) => {
    // Construct public URL relative to server
    return `${protocol}://${host}/uploads/products/${f.filename}`;
  });

  res.json({ success: true, images });
};
