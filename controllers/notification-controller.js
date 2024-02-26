import Notification from "../model/Notification.js";

export const getNotification = async (req, res) => {
  const id = req.params.id;
  try {
    const notify = await Notification.findById(id);
    if (!notify) {
      return res.status(404).send({ messagae: "No notification found !!" });
    }
    res.status(200).json({ notify });
  } catch (err) {
    console.log("error", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
