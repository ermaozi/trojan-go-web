import { get, post } from './http'

export const getNodeStatus = data => get('/node/get_node_status', data)

export const getNodeInfo = data => get('/node/get_node_info', data)

export const addNode = data => post('/node/add_node', data)

export const userRegister = data => post('/user/register', data)

export const setUser = data => post('/user/set_user', data)

export const delUser = data => post('/user/del_user', data)

export const getAllUser = data => get('/user/get_all_user', data)