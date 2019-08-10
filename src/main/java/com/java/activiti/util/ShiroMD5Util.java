package com.java.activiti.util;

import org.apache.shiro.crypto.hash.SimpleHash;

public class ShiroMD5Util {
    //添加user的密码加密方法
    public static String  getMD5Password(String passoword) {
        String hashAlgorithmName = "MD5";//加密方式  
        int hashIterations = 1;//加密1次  
        SimpleHash hash = new SimpleHash(hashAlgorithmName,passoword.getBytes(),null,hashIterations);
        return hash.toString();
    }  
}
