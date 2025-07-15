import { isNumber } from 'jet-validators';
import { transform } from 'jet-validators/utils';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import UserService from '@src/services/UserService';
import User from '@src/models/User';

import { IReq, IRes } from './common/types';
import { parseReq, getRooms, getChats } from './common/util';
import path from 'path';


/******************************************************************************
                                Constants
******************************************************************************/

const Validators = {
  add: parseReq({ user: User.test }),
  update: parseReq({ user: User.test }),
  delete: parseReq({ id: transform(Number, isNumber) }),
} as const;

const viewsDir = path.join(__dirname, '../', 'views');

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll();
  res.status(HttpStatusCodes.OK).json({ users });
}

/**
 * Add one user.
 */
async function add(req: IReq, res: IRes) {
  const { user } = Validators.add(req.body);
  await UserService.addOne(user);
  res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one user.
 */
async function update(req: IReq, res: IRes) {
  const { user } = Validators.update(req.body);
  await UserService.updateOne(user);
  res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one user.
 */
async function delete_(req: IReq, res: IRes) {
  const { id } = Validators.delete(req.params);
  await UserService.delete(id);
  res.status(HttpStatusCodes.OK).end();
}

/**
 * Open chat system
 */
function generateRoom(toName: any, fromName: any) {
  return `chat:${fromName}:${toName}`;
}

async function chat_(req: IReq, res: IRes) {
  const { to, from } = req.query;

  const [toId, toName] = new String(to).split(':');
  const [fromId, fromName] = new String(from).split(':');

  const rooms = getRooms();
  const roomId = generateRoom(toName, fromName);

  // If new one comes
  const roomExist = rooms.find(room => (room?.users[0] == toId && room?.users[1] == fromId) || (room?.users[1] == toId && room?.users[0] == fromId));
  if (!roomExist) {
    rooms.push({ roomId, users: [toId, fromId] });
  }

  return res.status(HttpStatusCodes.OK).sendFile('chat.html', { root: viewsDir });
}

/**
 * Load Room Chats
 */
async function loadChats_(req: IReq, res: IRes) {
  const { to, from } = req.query;

  const [toId] = new String(to).split(':');
  const [fromId] = new String(from).split(':');

  // If room has some chats
  const chats = getChats();
  console.log("load chats", chats);
  const room_chats = chats.filter(chat => (chat.from == fromId && chat.to == toId) || (chat.to == fromId && chat.from == toId));

  res.status(HttpStatusCodes.OK).json({ room_chats });
}

/**
 * Generate Room Chats
 */
async function generateChats_(req: IReq, res: IRes) {
  const { id } = req.query;

  const chats = getChats();
  const room_chats = chats.filter(chat => chat.from == id || chat.to == id);

  await UserService.generateDocs(room_chats);
  res.status(HttpStatusCodes.OK).json({ room_chats });
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  add,
  update,
  delete: delete_,
  chat: chat_,
  load: loadChats_,
  generate: generateChats_,
} as const;
