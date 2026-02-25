import { Request, Response } from "express";
import { usersData, User } from "../../data/users";

const getUsers = (request: Request, response: Response): void => {
  console.log("getUsers");
  response.status(200).json(usersData);
};

const postUser = (request: Request, response: Response): void => {
  console.log("postUser", request.body);

  try {
    const newUser: User = {
      id: String(usersData.length + 1),
      ...request.body,
      createdAt: new Date().toISOString(),
      active: true,
      preferences: {
        theme: "light",
        notifications: true,
        language: "en",
        ...request.body.preferences,
      },
    } as User;

    usersData.push(newUser);
    response.status(201).json(newUser);
  } catch (error) {
    response.status(400).json({ error: "Invalid user data" });
  }
};

const putUser = (request: Request, response: Response): void => {
  const { id } = request.params;
  console.log("putUser", id, request.body);

  try {
    const userIndex = usersData.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      response.status(404).json({ error: "User not found" });
      return;
    }

    usersData[userIndex] = { ...usersData[userIndex], ...request.body };
    response.status(200).json(usersData[userIndex]);
  } catch (error) {
    response.status(400).json({ error: "Invalid user data" });
  }
};

export { getUsers, postUser, putUser };
