package com.java.activiti.plugin;

import org.mybatis.generator.api.IntrospectedColumn;
import org.mybatis.generator.api.IntrospectedTable;
import org.mybatis.generator.api.PluginAdapter;
import org.mybatis.generator.api.dom.xml.Attribute;
import org.mybatis.generator.api.dom.xml.Document;
import org.mybatis.generator.api.dom.xml.TextElement;
import org.mybatis.generator.api.dom.xml.XmlElement;
import org.mybatis.generator.codegen.mybatis3.MyBatis3FormattingUtilities;

import java.util.List;

/**
 * UpdateSelectiveGeneratorPlugin
 *
 * mybatis generator config 绀轰緥锛�
 * <plugin type="com.thinkj2ee.cms.mybatis.generator.extend.UpdateSelectiveGeneratorPlugin" />
 *
 * @author 鍑″<jihaoju@qq.com>
 * @copyright thinkj2ee.com
 * @date 2016/11/10
 */
public class UpdateSelectiveGeneratorPlugin extends PluginAdapter {

    @Override
    public boolean validate(List<String> warnings) {
        boolean result = true;
        return result;
    }

    @Override
    public boolean sqlMapDocumentGenerated(Document document, IntrospectedTable introspectedTable) {
        List<IntrospectedColumn> primaryKeyColumns = introspectedTable.getPrimaryKeyColumns();

        XmlElement answer = new XmlElement("update");
        answer.addAttribute(new Attribute("id", "updateSelective"));
        answer.addAttribute(new Attribute("parameterType", introspectedTable.getBaseRecordType()));

        StringBuilder sb = new StringBuilder();
        sb.append("update ");
        sb.append(introspectedTable.getAliasedFullyQualifiedTableNameAtRuntime());
        answer.addElement(new TextElement(sb.toString()));

        XmlElement dynamicElement = new XmlElement("set"); //$NON-NLS-1$
        answer.addElement(dynamicElement);

        for (IntrospectedColumn introspectedColumn : introspectedTable.getAllColumns()) {
            if(primaryKeyColumns != null && primaryKeyColumns.get(0).getActualColumnName().equals(introspectedColumn.getActualColumnName())) {
                continue;
            }
            XmlElement isNotNullElement = new XmlElement("if"); //$NON-NLS-1$
            sb.setLength(0);
            sb.append(introspectedColumn.getJavaProperty("")); //$NON-NLS-1$
            sb.append(" != null"); //$NON-NLS-1$
            isNotNullElement.addAttribute(new Attribute("test", sb.toString())); //$NON-NLS-1$
            dynamicElement.addElement(isNotNullElement);

            sb.setLength(0);
            sb.append(MyBatis3FormattingUtilities.getAliasedEscapedColumnName(introspectedColumn));
            sb.append(" = "); //$NON-NLS-1$
            sb.append(MyBatis3FormattingUtilities.getParameterClause(introspectedColumn, "")); //$NON-NLS-1$
            sb.append(',');

            isNotNullElement.addElement(new TextElement(sb.toString()));
        }

        if(primaryKeyColumns != null) {
            sb.setLength(0);
            sb.append("where ");
            sb.append(primaryKeyColumns.get(0).getActualColumnName());
            sb.append("=");
            sb.append(MyBatis3FormattingUtilities.getParameterClause(primaryKeyColumns.get(0), ""));
            answer.addElement(new TextElement(sb.toString()));
        }

        document.getRootElement().addElement(answer);
        return true;
    }

}
