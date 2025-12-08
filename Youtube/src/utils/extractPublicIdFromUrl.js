export const extractPublicIdFromUrl = (url) => {
    // remove query params
    const cleanUrl = url.split("?")[0];

    // split after /upload/
    const parts = cleanUrl.split("/upload/")[1];

    // remove version (v123456)
    const publicIdWithExt = parts.replace(/^v\d+\//, "");

    // remove extension
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");

    return publicId;
};
