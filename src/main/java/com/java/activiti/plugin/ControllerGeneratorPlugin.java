package com.java.activiti.plugin;

import org.mybatis.generator.api.GeneratedJavaFile;
import org.mybatis.generator.api.IntrospectedTable;
import org.mybatis.generator.api.PluginAdapter;
import org.mybatis.generator.api.dom.java.*;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;

import static org.mybatis.generator.internal.util.StringUtility.stringHasValue;
import static org.mybatis.generator.internal.util.messages.Messages.getString;

/**
 * ControllerGeneratorPlugin ����controller��
 */
public class ControllerGeneratorPlugin extends PluginAdapter {

	// ��ĿĿ¼��eg: src/main/java
	private String targetProject;

	// control������eg:com.java.activiti.Controller
	private String controllerPackage;

	// controller�ӿ���ǰ׺
	private String controllerPreffix;

	// controller�ӿ�����׺
	private String controllerSuffix;

	private String recordType;

	private String modelName;

	private FullyQualifiedJavaType model;

	// controller�ӿ�����
	private String controllerName;

	@Override
	public boolean validate(List<String> warnings) {
		boolean valid = true;
		// ��ĿĿ¼����Ϊ��
		if (!stringHasValue(properties.getProperty("targetProject"))) {
			warnings.add(getString("ValidationError.18", "MapperConfigPlugin", "targetProject"));
			valid = false;
		}
		// controller�ӿڰ���
		if (!stringHasValue(properties.getProperty("controllerPackage"))) {
			warnings.add(getString("ValidationError.18", "MapperConfigPlugin", "controllerPackage"));
			valid = false;
		}
		targetProject = properties.getProperty("targetProject");// ��Ŀ��
		controllerPackage = properties.getProperty("controllerPackage");// controller�ӿڰ���
		controllerPreffix = stringHasValue(properties.getProperty("controllerPreffix")) ? controllerPreffix : "";// ǰ׺
		controllerSuffix = stringHasValue(properties.getProperty("controllerSuffix")) ? controllerSuffix : "";// ��׺
		return valid;
	}

	@Override
	public List<GeneratedJavaFile> contextGenerateAdditionalJavaFiles(IntrospectedTable introspectedTable) {
		recordType = introspectedTable.getBaseRecordType();// ��ȡmodel
		modelName = recordType.substring(recordType.lastIndexOf(".") + 1);// ��ȡmodel��
		controllerName = controllerPackage + "." + controllerPreffix + modelName + "Controller" + controllerSuffix;
		List<GeneratedJavaFile> answer = new ArrayList<>();
		GeneratedJavaFile gjf = generateController(introspectedTable);
		answer.add(gjf);
		return answer;
	}

	// ����controller��
	private GeneratedJavaFile generateController(IntrospectedTable introspectedTable) {
		recordType = introspectedTable.getBaseRecordType();// ��ȡmodel
		modelName = recordType.substring(recordType.lastIndexOf(".") + 1);// ��ȡmodel��
		model = new FullyQualifiedJavaType(recordType);// ��ȡmodel����
		
		FullyQualifiedJavaType controller = new FullyQualifiedJavaType(controllerName);
		TopLevelClass clazz = new TopLevelClass(controller);
		clazz.setVisibility(JavaVisibility.PUBLIC);
		clazz.addAnnotation("@Controller");
		clazz.addAnnotation("@RequestMapping(\"/"+modelName+"\")");
		String servieFieldName = modelName+"Service";
		String serviceFieldType = "com.java.activiti.service."+modelName+"Service";
		Field serviceField = new Field(modelName+"Service", new FullyQualifiedJavaType(serviceFieldType));
		clazz.addImportedType(new FullyQualifiedJavaType(serviceFieldType));
		clazz.addImportedType(new FullyQualifiedJavaType("org.springframework.beans.factory.annotation.Autowired"));
		clazz.addImportedType(new FullyQualifiedJavaType("java.util.List"));
		clazz.addImportedType(new FullyQualifiedJavaType("org.springframework.stereotype.Controller"));
		clazz.addImportedType(new FullyQualifiedJavaType("org.springframework.web.bind.annotation.RequestMapping"));
		clazz.addImportedType(model);
		serviceField.addAnnotation("@Autowired");
		serviceField.setVisibility(JavaVisibility.PRIVATE);
		clazz.addField(serviceField);
		
		FullyQualifiedJavaType intReturnType = new FullyQualifiedJavaType("int");
		FullyQualifiedJavaType IntegerReturnType = new FullyQualifiedJavaType("java.lang.Integer");
		FullyQualifiedJavaType listReturnType = new FullyQualifiedJavaType("java.util.List<" + modelName + ">");

		Method deleteByPrimaryKeyMethod = new Method("deleteByPrimaryKey");
		deleteByPrimaryKeyMethod.addAnnotation("@RequestMapping(\"/deleteByPrimaryKey\")");
		Parameter deleteByPrimaryKeyparameter = new Parameter(IntegerReturnType, "id");
		deleteByPrimaryKeyMethod.addParameter(deleteByPrimaryKeyparameter);
		deleteByPrimaryKeyMethod.setVisibility(JavaVisibility.PUBLIC);
		deleteByPrimaryKeyMethod.setReturnType(intReturnType);
		String a = "/deleteByPrimaryKey";
		deleteByPrimaryKeyMethod.addBodyLine("return " + servieFieldName + ".deleteByPrimaryKey(id);");
		clazz.addMethod(deleteByPrimaryKeyMethod);

		Method insertMethod = new Method("insert");
		insertMethod.addAnnotation("@RequestMapping(\"/insert\")");
		Parameter insertParameter = new Parameter(model, "record");
		insertMethod.setVisibility(JavaVisibility.PUBLIC);
		insertMethod.addParameter(insertParameter);
		insertMethod.setReturnType(intReturnType);
		insertMethod.addBodyLine("return " + servieFieldName + ".insert(record);");
		clazz.addMethod(insertMethod);

		Method selectByPrimaryKeyMethod = new Method("selectByPrimaryKey");
		selectByPrimaryKeyMethod.addAnnotation("@RequestMapping(\"/selectByPrimaryKey\")");
		Parameter selectByPrimaryKeyparameter = new Parameter(IntegerReturnType, "id");
		selectByPrimaryKeyMethod.setVisibility(JavaVisibility.PUBLIC);
		selectByPrimaryKeyMethod.addParameter(selectByPrimaryKeyparameter);
		selectByPrimaryKeyMethod.setReturnType(model);
		selectByPrimaryKeyMethod.addBodyLine("return " + servieFieldName + ".selectByPrimaryKey(id);");
		clazz.addMethod(selectByPrimaryKeyMethod);

		Method selectAllMethod = new Method("selectAll");
		selectAllMethod.addAnnotation("@RequestMapping(\"/selectAll\")");
		selectAllMethod.setVisibility(JavaVisibility.PUBLIC);
		selectAllMethod.setReturnType(listReturnType);
		selectAllMethod.addBodyLine("return " + servieFieldName + ".selectAll();");
		clazz.addMethod(selectAllMethod);

		Method updateByPrimaryKeyMethod = new Method("updateByPrimaryKey");
		updateByPrimaryKeyMethod.addAnnotation("@RequestMapping(\"/updateByPrimaryKey\")");
		Parameter updateByPrimaryKeyParameter = new Parameter(model, "record");
		updateByPrimaryKeyMethod.setVisibility(JavaVisibility.PUBLIC);
		updateByPrimaryKeyMethod.addParameter(updateByPrimaryKeyParameter);
		updateByPrimaryKeyMethod.setReturnType(intReturnType);
		updateByPrimaryKeyMethod.addBodyLine("return " + servieFieldName + ".updateByPrimaryKey(record);");
		clazz.addMethod(updateByPrimaryKeyMethod);
		GeneratedJavaFile gjf = new GeneratedJavaFile(clazz, targetProject, context.getJavaFormatter());
		return gjf;
	}

	private String firstCharToLowCase(String str) {
		char[] chars = new char[1];
		chars[0] = str.charAt(0);
		String temp = new String(chars);
		if (chars[0] >= 'A' && chars[0] <= 'Z') {
			return str.replaceFirst(temp, temp.toLowerCase());
		}
		return str;
	}
}