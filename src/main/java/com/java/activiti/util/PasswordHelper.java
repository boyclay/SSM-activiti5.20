package com.java.activiti.util;

import org.apache.shiro.crypto.RandomNumberGenerator;
import org.apache.shiro.crypto.SecureRandomNumberGenerator;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.util.ByteSource;
import org.springframework.stereotype.Component;

import com.java.activiti.model.User;

/**
 * @auther wqb
 * @date 2019/8/14
 */
@Component
public class PasswordHelper {

	private RandomNumberGenerator randomNumberGenerator = new SecureRandomNumberGenerator();

	private String algorithName = "MD5";

	private int hashInterations = 1;

	//加密算法
	public void encryptPassword(User user) {
		if (user.getPassword() != null) {
			String salt = randomNumberGenerator.nextBytes().toHex();// 设置随机数盐 需要数据库存储
			//调用SimpleHash指定散列算法参数：1、算法名称；2、用户输入的密码；3、盐值（随机生成的）；4、迭代次数
			String newPassword = new SimpleHash(algorithName, user.getPassword(), ByteSource.Util.bytes(salt),
					hashInterations).toHex();
			user.setPassword(newPassword);
		}
	}
}
