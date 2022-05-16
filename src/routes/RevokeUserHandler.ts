import { revokeUser } from "../connection/RevokeUser";

export const revokeUserHandler = async (req, res) => {
    console.log(req.body);
    let userId = req.body.userId;
    if (!userId) {
      return res.send("Missing userId parameter")
    }
  
    let response = await revokeUser(userId);
  
    if (response.error) {
      res.send(response.error);
    } else {
      res.send(response);
    }
  }