package com.java.activiti.plugin;

import org.mybatis.generator.api.IntrospectedTable;
import org.mybatis.generator.api.PluginAdapter;
import org.mybatis.generator.api.dom.java.FullyQualifiedJavaType;
import org.mybatis.generator.api.dom.java.Interface;
import org.mybatis.generator.api.dom.java.TopLevelClass;

import java.util.List;

import static org.mybatis.generator.internal.util.StringUtility.stringHasValue;
import static org.mybatis.generator.internal.util.messages.Messages.getString;

/**
 * SuperMapperGeneratorPlugin
 *
 * mybatis generator config 绀轰緥锛�
 * <plugin type="com.thinkj2ee.cms.mybatis.generator.extend.SuperMapperGeneratorPlugin">
 * <property name="superMapper" value="com.thinkj2ee.cms.core.persistance.mybatis.IDao"></property>
 * </plugin>
 *
 * @author 鍑″<jihaoju@qq.com>
 * @copyright thinkj2ee.com
 * @date 2016/11/10
 */
public class SuperMapperGeneratorPlugin extends PluginAdapter {

    @Override
    public boolean validate(List<String> warnings) {
        boolean result = true;
        if (!stringHasValue(properties.getProperty("superMapper"))) { //$NON-NLS-1$
            warnings.add(getString("ValidationError.18", //$NON-NLS-1$
                    "SuperMapperGeneratorPlugin", //$NON-NLS-1$
                    "superMapper")); //$NON-NLS-1$
            result = false;
        }
        return result;
    }

    @Override
    public boolean clientGenerated(Interface interfaze,
                                   TopLevelClass topLevelClass, IntrospectedTable introspectedTable) {
        /**
         * 涓婚敭榛樿閲囩敤java.lang.Integer
         */
        String superMapperPackage = properties.getProperty("superMapper");
        String superMapper = superMapperPackage.substring(superMapperPackage.lastIndexOf(".") + 1);
        FullyQualifiedJavaType fqjt = new FullyQualifiedJavaType(superMapper + "<" + introspectedTable.getBaseRecordType() + ">");
        FullyQualifiedJavaType imp = new FullyQualifiedJavaType(superMapperPackage);
        /**
         * 娣诲姞 extends MybatisBaseMapper
         */
        interfaze.addSuperInterface(fqjt);
        /**
         * 娣诲姞import my.mabatis.example.base.MybatisBaseMapper;
         */
        interfaze.addImportedType(imp);
        //interfaze.addImportedType(new FullyQualifiedJavaType(introspectedTable.getBaseRecordType()));
        /**
         * 鏂规硶涓嶉渶瑕�
         */
        interfaze.getMethods().clear();
        interfaze.getAnnotations().clear();
        return true;
    }

}
