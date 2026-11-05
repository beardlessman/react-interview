import React, { useState } from 'react';

export const BulkItemUploader: React.FC = () => {
  const [uploadedCount, setUploadedCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadItems = async (items: string[]) => {
    setIsUploading(true);

    // Параллельная загрузка пачки элементов
    const uploadPromises = items.map(async (item) => {
      await fetch('https://example.com', { method: 'POST', body: item });
      // Пытаемся инкрементировать счетчик по завершении каждой загрузки
      setUploadedCount(uploadedCount + 1);
    });

    await Promise.all(uploadPromises);
    setIsUploading(false);
  };

  return (
    <div>
      <button onClick={() => uploadItems(['file1', 'file2', 'file3'])} disabled={isUploading}>
        Upload 3 Files
      </button>
      <p>Uploaded: {uploadedCount}</p>
    </div>
  );
};
