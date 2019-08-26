package com.java.activiti.util;

import net.sf.json.JsonConfig;
import net.sf.json.util.PropertyFilter;

import java.util.List;

import com.java.activiti.model.OnlineUser;

/**
 * @author ccq
 * @Description JSONObject转化json过滤属�?�方�?
 * @date 2017/12/16 19:16
 */
public class JsonConfigUtils {


    public static JsonConfig getJsonConfig(final List<String> propertys){

        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.setJsonPropertyFilter(new PropertyFilter() {
            public boolean apply(Object object, String property, Object value) {
                if(object instanceof OnlineUser ){
                    if (propertys.contains(property)){
                        //返回true属�?�不会被序列�?
                        return true;
                    }
                }
                return false;
            }
        });
        return jsonConfig;
    }

}
