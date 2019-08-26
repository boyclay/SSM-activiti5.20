package com.java.activiti.util;

import java.util.Set;

import javax.annotation.Resource;

import org.springframework.stereotype.Component;


import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

@Component
public class JedisUtil {
	
	@Resource
	private JedisPool jedisPool;
	
	private Jedis getResource(){
		return jedisPool.getResource();
	}
	
	/*
	 * 存session
	 */
	public byte[] set(byte[]key,byte[]value){
		Jedis jedis = getResource();
		try {
			jedis.set(key, value);
			return value;
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			jedis.close();
		}
		return value;
	}
	
	/*
	 * 设置超时时间
	 */
	public void  expire(byte[]key,int seconds){
		Jedis jedis = getResource();
		try {
			jedis.expire(key, seconds);
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			jedis.close();
		}
	}
	
	/*
	 * 获取session值
	 */
	public byte[] get(byte[]key){
		Jedis jedis = getResource();
		try {
			return jedis.get(key);
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			jedis.close();
		}
		return null;
	}
	
	/*
	 * 删除session
	 */
	public void  del(byte[]key){
		Jedis jedis = getResource();
		try {
			jedis.del(key);
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			jedis.close();
		}
	}
	
	/*
	 * 获取所有session
	 */
	public Set<byte[]> keys(){
		Jedis jedis = getResource(); 
		try {
			return jedis.keys("*".getBytes());
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			jedis.close();
		}
		return null;
	}
}
