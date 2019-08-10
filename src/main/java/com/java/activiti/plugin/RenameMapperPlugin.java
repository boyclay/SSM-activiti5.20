package com.java.activiti.plugin;

import org.mybatis.generator.api.IntrospectedTable;
import org.mybatis.generator.api.PluginAdapter;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.mybatis.generator.internal.util.StringUtility.stringHasValue;

/**
 * RenameMapperPlugin
 *
 * 閲嶅懡鍚嶇敓鎴愮殑Dao绫伙紝鍙互娣诲姞鍓嶇紑鍜屽悗缂�
 * MemberMapper锛屽彲閲嶅懡鍚嶄负锛欼MemberDao
 *
 * mybatis generator config 绀轰緥锛�
 * <plugin type="com.thinkj2ee.cms.mybatis.generator.extend.RenameMapperPlugin">
 * <property name="mapperPreffix" value="I"></property>
 * <property name="mapperSuffix" value="Dao"></property>
 * </plugin>
 *
 * @author 鍑″<jihaoju@qq.com>
 * @copyright thinkj2ee.com
 * @date 2016/11/10
 */
public class RenameMapperPlugin extends PluginAdapter {

    private String mapperPreffix;
    private String mapperSuffix;

    @Override
    public boolean validate(List<String> warnings) {
        boolean result = true;
        return result;
    }

    @Override
    public void initialized(IntrospectedTable introspectedTable) {
        String mapperType = introspectedTable.getMyBatis3JavaMapperType();
        String oldMapperName = mapperType.substring(mapperType.lastIndexOf(".") + 1);

        mapperPreffix = properties.getProperty("mapperPreffix");
        mapperSuffix = properties.getProperty("mapperSuffix");
        if(stringHasValue(mapperPreffix)) {
            String newMapperName = mapperPreffix + oldMapperName;
            Pattern pattern = Pattern.compile(oldMapperName);
            Matcher matcher = pattern.matcher(mapperType);
            mapperType = matcher.replaceAll(newMapperName);
        }
        if(stringHasValue(mapperSuffix)) {
            Pattern pattern = Pattern.compile("Mapper");
            Matcher matcher = pattern.matcher(mapperType);
            mapperType = matcher.replaceAll(mapperSuffix);
        }
        introspectedTable.setMyBatis3JavaMapperType(mapperType);
    }

}
