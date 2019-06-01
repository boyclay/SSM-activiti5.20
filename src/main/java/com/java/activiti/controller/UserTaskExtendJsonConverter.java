package com.java.activiti.controller;

import java.util.List;
import java.util.Map;

import org.activiti.bpmn.model.Activity;
import org.activiti.bpmn.model.BaseElement;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.CustomProperty;
import org.activiti.bpmn.model.DataAssociation;
import org.activiti.bpmn.model.Event;
import org.activiti.bpmn.model.FieldExtension;
import org.activiti.bpmn.model.FlowElement;
import org.activiti.bpmn.model.FlowElementsContainer;
import org.activiti.bpmn.model.FormProperty;
import org.activiti.bpmn.model.ServiceTask;
import org.activiti.bpmn.model.UserTask;
import org.activiti.editor.language.json.converter.ActivityProcessor;
import org.activiti.editor.language.json.converter.BaseBpmnJsonConverter;
import org.activiti.editor.language.json.converter.UserTaskJsonConverter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class UserTaskExtendJsonConverter extends UserTaskJsonConverter {
	
	@Override
	protected FlowElement convertJsonToElement(JsonNode elementNode, JsonNode modelNode,
			Map<String, JsonNode> shapeMap) {
		FlowElement flowElement = super.convertJsonToElement(elementNode, modelNode, shapeMap);
		UserTask userTask = (UserTask) flowElement;
		// 将自己的属性添加到activiti自带的自定义属性中
		CustomProperty customProperty = new CustomProperty();
		customProperty.setName("assignernull");
		customProperty.setSimpleValue(this.getPropertyValueAsString("assignernull", elementNode));
		userTask.getCustomProperties().add(customProperty);
		return userTask;
	}

	@Override
	protected void convertElementToJson(ObjectNode propertiesNode, BaseElement baseElement) {
		super.convertElementToJson(propertiesNode, baseElement);
	}

	@Override
	protected String getStencilId(BaseElement baseElement) {
		// TODO Auto-generated method stub
		return super.getStencilId(baseElement);
	}

	@Override
	public void convertToJson(BaseElement baseElement, ActivityProcessor processor, BpmnModel model,
			FlowElementsContainer container, ArrayNode shapesArrayNode, double subProcessX, double subProcessY) {
		// TODO Auto-generated method stub
		super.convertToJson(baseElement, processor, model, container, shapesArrayNode, subProcessX, subProcessY);
	}

	@Override
	protected void processDataStoreReferences(FlowElementsContainer container, String dataStoreReferenceId,
			ArrayNode outgoingArrayNode) {
		// TODO Auto-generated method stub
		super.processDataStoreReferences(container, dataStoreReferenceId, outgoingArrayNode);
	}

	@Override
	protected void createDataAssociation(DataAssociation dataAssociation, boolean incoming, Activity activity) {
		// TODO Auto-generated method stub
		super.createDataAssociation(dataAssociation, incoming, activity);
	}

	@Override
	public void convertToBpmnModel(JsonNode elementNode, JsonNode modelNode, ActivityProcessor processor,
			BaseElement parentElement, Map<String, JsonNode> shapeMap, BpmnModel bpmnModel) {
		// TODO Auto-generated method stub
		super.convertToBpmnModel(elementNode, modelNode, processor, parentElement, shapeMap, bpmnModel);
	}

	@Override
	protected void setPropertyValue(String name, String value, ObjectNode propertiesNode) {
		// TODO Auto-generated method stub
		super.setPropertyValue(name, value, propertiesNode);
	}

	@Override
	protected void addFormProperties(List<FormProperty> formProperties, ObjectNode propertiesNode) {
		// TODO Auto-generated method stub
		super.addFormProperties(formProperties, propertiesNode);
	}

	@Override
	protected void addFieldExtensions(List<FieldExtension> extensions, ObjectNode propertiesNode) {
		// TODO Auto-generated method stub
		super.addFieldExtensions(extensions, propertiesNode);
	}

	@Override
	protected void addEventProperties(Event event, ObjectNode propertiesNode) {
		// TODO Auto-generated method stub
		super.addEventProperties(event, propertiesNode);
	}

	@Override
	protected void convertJsonToFormProperties(JsonNode objectNode, BaseElement element) {
		// TODO Auto-generated method stub
		super.convertJsonToFormProperties(objectNode, element);
	}

	@Override
	protected void convertJsonToTimerDefinition(JsonNode objectNode, Event event) {
		// TODO Auto-generated method stub
		super.convertJsonToTimerDefinition(objectNode, event);
	}

	@Override
	protected void convertJsonToSignalDefinition(JsonNode objectNode, Event event) {
		// TODO Auto-generated method stub
		super.convertJsonToSignalDefinition(objectNode, event);
	}

	@Override
	protected void convertJsonToMessageDefinition(JsonNode objectNode, Event event) {
		// TODO Auto-generated method stub
		super.convertJsonToMessageDefinition(objectNode, event);
	}

	@Override
	protected void convertJsonToErrorDefinition(JsonNode objectNode, Event event) {
		// TODO Auto-generated method stub
		super.convertJsonToErrorDefinition(objectNode, event);
	}

	@Override
	protected String getValueAsString(String name, JsonNode objectNode) {
		// TODO Auto-generated method stub
		return super.getValueAsString(name, objectNode);
	}

	@Override
	protected boolean getValueAsBoolean(String name, JsonNode objectNode) {
		// TODO Auto-generated method stub
		return super.getValueAsBoolean(name, objectNode);
	}

	@Override
	protected List<String> getValueAsList(String name, JsonNode objectNode) {
		// TODO Auto-generated method stub
		return super.getValueAsList(name, objectNode);
	}

	@Override
	protected void addField(String name, JsonNode elementNode, ServiceTask task) {
		// TODO Auto-generated method stub
		super.addField(name, elementNode, task);
	}

	@Override
	protected void addField(String name, String propertyName, JsonNode elementNode, ServiceTask task) {
		// TODO Auto-generated method stub
		super.addField(name, propertyName, elementNode, task);
	}

	@Override
	protected String getPropertyValueAsString(String name, JsonNode objectNode) {
		// TODO Auto-generated method stub
		return super.getPropertyValueAsString(name, objectNode);
	}

	@Override
	protected boolean getPropertyValueAsBoolean(String name, JsonNode objectNode) {
		// TODO Auto-generated method stub
		return super.getPropertyValueAsBoolean(name, objectNode);
	}

	@Override
	protected List<String> getPropertyValueAsList(String name, JsonNode objectNode) {
		// TODO Auto-generated method stub
		return super.getPropertyValueAsList(name, objectNode);
	}

	@Override
	protected JsonNode getProperty(String name, JsonNode objectNode) {
		// TODO Auto-generated method stub
		return super.getProperty(name, objectNode);
	}

	@Override
	protected String convertListToCommaSeparatedString(List<String> stringList) {
		// TODO Auto-generated method stub
		return super.convertListToCommaSeparatedString(stringList);
	}
}
