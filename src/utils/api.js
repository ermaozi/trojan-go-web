import { get, post, put, del } from './http'

export const login = data => post('/login', data)

export const getNodeStatus = data => post('/node/get_node_status', data)

export const getNodeInfo = data => get('/node/get_node_info', data)

export const addNode = data => post('/node/add_node', data)

export const userRegister = data => post('/user/user', data)

export const setUser = data => put('/user/user', data)

export const delUser = data => del('/user/user', data)

export const getAllUser = data => get('/user/user', data)

export const subscribe = data => post('/user/subscribe', data)

export const getTrojanUrl = data => get('/user/get_trojan_url', data)