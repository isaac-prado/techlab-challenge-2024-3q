import { Request, Response } from "express";
import { User } from "../entities/User.js";
import { database } from "../services/database.js";
import { Not } from "typeorm";

export class UsersController {
  protected get repository() {
    return database.getRepository(User)
  }

  /**
   * GET /users
   */
  public async find(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const skip = (page - 1) * limit

    const [users, count] = await this.repository.findAndCount({
      take: limit,
      skip: skip
    })

    res.json({ 
      count,
      page,
      totalPages: Math.ceil(count/limit),
      users
    })
  }

  /**
   * GET /users/:user-id
   */
  public async findOne(req: Request<{ userId: string }>, res: Response) {
    const user = await this.repository.findOne({
      where: { id: req.params.userId }
    })
    
    if (!user) return res.status(404).json({ message: `Not found User with ID ${req.params.userId}` })
    
    return res.json(user)
  }

  /**
   * PUT /users
   */
  public async save(req: Request, res: Response) {
    const user = await this.repository.save(req.body)

    res.status(201)
      .header('Location', `/users/${user.id}`)
      .json(user)
  }

  /**
   * PATCH /users/:user-id
   */
  public async update(req: Request<{ userId: string }>, res: Response) {
    const user = await this.repository.findOne({
      where: { id: req.params.userId }
    })

    if (!user) return res.status(404).json({ message: `Not found User with ID ${req.params.userId}` })
    
    if (req.body.email && req.body.email !== user.email) {
      const checkEmail = await this.repository.find({
        where: { email: req.body.email, id: Not(req.params.userId )}
      });

      if (checkEmail) {
        return res.status(400).json({ message: `Email address already used.` })
      }
    }

    if (req.body.username && req.body.username !== user.username) {
      const checkUsername = await this.repository.find({
        where: { username: req.body.username, id: Not(req.params.userId)}
      });

      if (checkUsername) {
        return res.status(400).json({ message: `Username already used.` })
      }
    }

    const newUserData = { ...req.body };

    const updatedUserEntity = this.repository.merge(user, newUserData);
    await this.repository.save(updatedUserEntity);

    return res.json(updatedUserEntity);
  }

  /**
   * DELETE /users/:user-id
   */
  public async delete(req: Request<{ userId: string }>, res: Response) {
    const user = await this.repository.findOne({
      where: { id: req.params.userId }
    })

    if (!user) return res.status(404).json({ message: `Not found User with ID ${req.params.userId}` })

    await this.repository.softRemove(user)

    res.json(user)
  }
   
}
