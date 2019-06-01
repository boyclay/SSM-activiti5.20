package com.java.activiti.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.activiti.bpmn.model.Activity;
import org.activiti.bpmn.model.BaseElement;
import org.activiti.bpmn.model.BoundaryEvent;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.Event;
import org.activiti.bpmn.model.EventDefinition;
import org.activiti.bpmn.model.ExtensionAttribute;
import org.activiti.bpmn.model.ExtensionElement;
import org.activiti.bpmn.model.FlowElement;
import org.activiti.bpmn.model.FlowElementsContainer;
import org.activiti.bpmn.model.FlowNode;
import org.activiti.bpmn.model.Gateway;
import org.activiti.bpmn.model.GraphicInfo;
import org.activiti.bpmn.model.Lane;
import org.activiti.bpmn.model.Message;
import org.activiti.bpmn.model.MessageEventDefinition;
import org.activiti.bpmn.model.Pool;
import org.activiti.bpmn.model.Process;
import org.activiti.bpmn.model.SequenceFlow;
import org.activiti.bpmn.model.Signal;
import org.activiti.bpmn.model.SignalEventDefinition;
import org.activiti.bpmn.model.SubProcess;
import org.activiti.bpmn.model.ValuedDataObject;
import org.activiti.editor.language.json.converter.AssociationJsonConverter;
import org.activiti.editor.language.json.converter.BaseBpmnJsonConverter;
import org.activiti.editor.language.json.converter.BoundaryEventJsonConverter;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.editor.language.json.converter.BpmnJsonConverterUtil;
import org.activiti.editor.language.json.converter.BusinessRuleTaskJsonConverter;
import org.activiti.editor.language.json.converter.CallActivityJsonConverter;
import org.activiti.editor.language.json.converter.CamelTaskJsonConverter;
import org.activiti.editor.language.json.converter.CatchEventJsonConverter;
import org.activiti.editor.language.json.converter.DataStoreJsonConverter;
import org.activiti.editor.language.json.converter.EndEventJsonConverter;
import org.activiti.editor.language.json.converter.EventGatewayJsonConverter;
import org.activiti.editor.language.json.converter.EventSubProcessJsonConverter;
import org.activiti.editor.language.json.converter.ExclusiveGatewayJsonConverter;
import org.activiti.editor.language.json.converter.InclusiveGatewayJsonConverter;
import org.activiti.editor.language.json.converter.MailTaskJsonConverter;
import org.activiti.editor.language.json.converter.ManualTaskJsonConverter;
import org.activiti.editor.language.json.converter.MessageFlowJsonConverter;
import org.activiti.editor.language.json.converter.MuleTaskJsonConverter;
import org.activiti.editor.language.json.converter.ParallelGatewayJsonConverter;
import org.activiti.editor.language.json.converter.ReceiveTaskJsonConverter;
import org.activiti.editor.language.json.converter.ScriptTaskJsonConverter;
import org.activiti.editor.language.json.converter.SendTaskJsonConverter;
import org.activiti.editor.language.json.converter.SequenceFlowJsonConverter;
import org.activiti.editor.language.json.converter.ServiceTaskJsonConverter;
import org.activiti.editor.language.json.converter.StartEventJsonConverter;
import org.activiti.editor.language.json.converter.SubProcessJsonConverter;
import org.activiti.editor.language.json.converter.TextAnnotationJsonConverter;
import org.activiti.editor.language.json.converter.ThrowEventJsonConverter;
import org.activiti.editor.language.json.converter.UserTaskJsonConverter;
import org.activiti.editor.language.json.converter.util.CollectionUtils;
import org.activiti.editor.language.json.converter.util.JsonConverterUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import math.geom2d.Point2D;
import math.geom2d.conic.Circle2D;
import math.geom2d.curve.AbstractContinuousCurve2D;
import math.geom2d.line.Line2D;
import math.geom2d.polygon.Polyline2D;

public class CustomBpmnJsonConverter extends BpmnJsonConverter {


	private static final List<String> DI_CIRCLES = new ArrayList<String>();
	private static final List<String> DI_RECTANGLES = new ArrayList<String>();
	private static final List<String> DI_GATEWAY = new ArrayList<String>();

	static {
		DI_CIRCLES.add(STENCIL_EVENT_START_ERROR);
		DI_CIRCLES.add(STENCIL_EVENT_START_MESSAGE);
		DI_CIRCLES.add(STENCIL_EVENT_START_NONE);
		DI_CIRCLES.add(STENCIL_EVENT_START_TIMER);
		DI_CIRCLES.add(STENCIL_EVENT_START_SIGNAL);

		DI_CIRCLES.add(STENCIL_EVENT_BOUNDARY_ERROR);
		DI_CIRCLES.add(STENCIL_EVENT_BOUNDARY_SIGNAL);
		DI_CIRCLES.add(STENCIL_EVENT_BOUNDARY_TIMER);
		DI_CIRCLES.add(STENCIL_EVENT_BOUNDARY_MESSAGE);
		DI_CIRCLES.add(STENCIL_EVENT_BOUNDARY_CANCEL);
		DI_CIRCLES.add(STENCIL_EVENT_BOUNDARY_COMPENSATION);

		DI_CIRCLES.add(STENCIL_EVENT_CATCH_MESSAGE);
		DI_CIRCLES.add(STENCIL_EVENT_CATCH_SIGNAL);
		DI_CIRCLES.add(STENCIL_EVENT_CATCH_TIMER);

		DI_CIRCLES.add(STENCIL_EVENT_THROW_NONE);
		DI_CIRCLES.add(STENCIL_EVENT_THROW_SIGNAL);

		DI_CIRCLES.add(STENCIL_EVENT_END_NONE);
		DI_CIRCLES.add(STENCIL_EVENT_END_ERROR);
		DI_CIRCLES.add(STENCIL_EVENT_END_CANCEL);
		DI_CIRCLES.add(STENCIL_EVENT_END_TERMINATE);

		DI_RECTANGLES.add(STENCIL_CALL_ACTIVITY);
		DI_RECTANGLES.add(STENCIL_SUB_PROCESS);
		DI_RECTANGLES.add(STENCIL_EVENT_SUB_PROCESS);
		DI_RECTANGLES.add(STENCIL_TASK_BUSINESS_RULE);
		DI_RECTANGLES.add(STENCIL_TASK_MAIL);
		DI_RECTANGLES.add(STENCIL_TASK_MANUAL);
		DI_RECTANGLES.add(STENCIL_TASK_RECEIVE);
		DI_RECTANGLES.add(STENCIL_TASK_SCRIPT);
		DI_RECTANGLES.add(STENCIL_TASK_SEND);
		DI_RECTANGLES.add(STENCIL_TASK_SERVICE);
		DI_RECTANGLES.add(STENCIL_TASK_USER);
		DI_RECTANGLES.add(STENCIL_TASK_CAMEL);
		DI_RECTANGLES.add(STENCIL_TASK_MULE);
		DI_RECTANGLES.add(STENCIL_TEXT_ANNOTATION);

		DI_GATEWAY.add(STENCIL_GATEWAY_EVENT);
		DI_GATEWAY.add(STENCIL_GATEWAY_EXCLUSIVE);
		DI_GATEWAY.add(STENCIL_GATEWAY_INCLUSIVE);
		DI_GATEWAY.add(STENCIL_GATEWAY_PARALLEL);
	}

	// 通过继承开放convertersToJsonMap的访问
	public static Map<Class<? extends BaseElement>, Class<? extends BaseBpmnJsonConverter>> getConvertersToJsonMap() {
		return convertersToJsonMap;
	}

	// 通过继承开放convertersToJsonMap的访问
	public static Map<String, Class<? extends BaseBpmnJsonConverter>> getConvertersToBpmnMap() {
		return convertersToBpmnMap;
	}

	@Override
	public ObjectNode convertToJson(BpmnModel model) {
		// TODO Auto-generated method stub
		return super.convertToJson(model);
	}

	@Override
	public void processFlowElements(FlowElementsContainer container, BpmnModel model, ArrayNode shapesArrayNode,
			double subProcessX, double subProcessY) {
		// TODO Auto-generated method stub
		super.processFlowElements(container, model, shapesArrayNode, subProcessX, subProcessY);
	}

	@Override
	protected void processFlowElement(FlowElement flowElement, FlowElementsContainer container, BpmnModel model,
			ArrayNode shapesArrayNode, double containerX, double containerY) {
		// TODO Auto-generated method stub
		super.processFlowElement(flowElement, container, model, shapesArrayNode, containerX, containerY);
	}

	@Override
	protected void processArtifacts(FlowElementsContainer container, BpmnModel model, ArrayNode shapesArrayNode,
			double containerX, double containerY) {
		// TODO Auto-generated method stub
		super.processArtifacts(container, model, shapesArrayNode, containerX, containerY);
	}

	@Override
	protected void processMessageFlows(BpmnModel model, ArrayNode shapesArrayNode) {
		// TODO Auto-generated method stub
		super.processMessageFlows(model, shapesArrayNode);
	}

	@Override
	public BpmnModel convertToBpmnModel(JsonNode modelNode) {
		BpmnModel bpmnModel = new BpmnModel();
		bpmnModel.setTargetNamespace("http://activiti.org/test");
		Map<String, JsonNode> shapeMap = new HashMap<String, JsonNode>();
		Map<String, JsonNode> sourceRefMap = new HashMap<String, JsonNode>();
		Map<String, JsonNode> edgeMap = new HashMap<String, JsonNode>();
		Map<String, List<JsonNode>> sourceAndTargetMap = new HashMap<String, List<JsonNode>>();

		readShapeDI(modelNode, 0, 0, shapeMap, sourceRefMap, bpmnModel);
		filterAllEdges(modelNode, edgeMap, sourceAndTargetMap, shapeMap, sourceRefMap);
		readEdgeDI(edgeMap, sourceAndTargetMap, bpmnModel);

		ArrayNode shapesArrayNode = (ArrayNode) modelNode.get(EDITOR_CHILD_SHAPES);

		if (shapesArrayNode == null || shapesArrayNode.size() == 0)
			return bpmnModel;

		boolean nonEmptyPoolFound = false;
		Map<String, Lane> elementInLaneMap = new HashMap<String, Lane>();
		// first create the pool structure
		for (JsonNode shapeNode : shapesArrayNode) {
			String stencilId = BpmnJsonConverterUtil.getStencilId(shapeNode);
			if (STENCIL_POOL.equals(stencilId)) {
				Pool pool = new Pool();
				pool.setId(BpmnJsonConverterUtil.getElementId(shapeNode));
				pool.setName(JsonConverterUtil.getPropertyValueAsString(PROPERTY_NAME, shapeNode));
				pool.setProcessRef(JsonConverterUtil.getPropertyValueAsString(PROPERTY_PROCESS_ID, shapeNode));
				pool.setExecutable(
						JsonConverterUtil.getPropertyValueAsBoolean(PROPERTY_PROCESS_EXECUTABLE, shapeNode, true));
				bpmnModel.getPools().add(pool);

				Process process = new Process();
				process.setId(pool.getProcessRef());
				process.setName(pool.getName());
				process.setExecutable(pool.isExecutable());
				bpmnModel.addProcess(process);

				ArrayNode laneArrayNode = (ArrayNode) shapeNode.get(EDITOR_CHILD_SHAPES);
				for (JsonNode laneNode : laneArrayNode) {
					// should be a lane, but just check to be certain
					String laneStencilId = BpmnJsonConverterUtil.getStencilId(laneNode);
					if (STENCIL_LANE.equals(laneStencilId)) {
						nonEmptyPoolFound = true;
						Lane lane = new Lane();
						lane.setId(BpmnJsonConverterUtil.getElementId(laneNode));
						lane.setName(JsonConverterUtil.getPropertyValueAsString(PROPERTY_NAME, laneNode));
						lane.setParentProcess(process);
						process.getLanes().add(lane);

						processJsonElements(laneNode.get(EDITOR_CHILD_SHAPES), modelNode, lane, shapeMap, bpmnModel);
						if (CollectionUtils.isNotEmpty(lane.getFlowReferences())) {
							for (String elementRef : lane.getFlowReferences()) {
								elementInLaneMap.put(elementRef, lane);
							}
						}
					}
				}
			}
		}

		// Signal Definitions exist on the root level
		JsonNode signalDefinitionNode = BpmnJsonConverterUtil.getProperty(PROPERTY_SIGNAL_DEFINITIONS, modelNode);
		signalDefinitionNode = BpmnJsonConverterUtil.validateIfNodeIsTextual(signalDefinitionNode);
		signalDefinitionNode = BpmnJsonConverterUtil.validateIfNodeIsTextual(signalDefinitionNode); 
		if (signalDefinitionNode != null) {
			if (signalDefinitionNode instanceof ArrayNode) {
				ArrayNode signalDefinitionArrayNode = (ArrayNode) signalDefinitionNode;
				Iterator<JsonNode> signalDefinitionIterator = signalDefinitionArrayNode.iterator();
				while (signalDefinitionIterator.hasNext()) {
					JsonNode signalDefinitionJsonNode = signalDefinitionIterator.next();
					String signalId = signalDefinitionJsonNode.get(PROPERTY_SIGNAL_DEFINITION_ID).asText();
					String signalName = signalDefinitionJsonNode.get(PROPERTY_SIGNAL_DEFINITION_NAME).asText();
					String signalScope = signalDefinitionJsonNode.get(PROPERTY_SIGNAL_DEFINITION_SCOPE).asText();
					Signal signal = new Signal();
					signal.setId(signalId);
					signal.setName(signalName);
					signal.setScope((signalScope.toLowerCase().equals("processinstance"))
							? Signal.SCOPE_PROCESS_INSTANCE : Signal.SCOPE_GLOBAL);
					bpmnModel.addSignal(signal);
				}
			}
		}

		if (nonEmptyPoolFound == false) {
			Process process = new Process();
			bpmnModel.getProcesses().add(process);
			process.setId(BpmnJsonConverterUtil.getPropertyValueAsString(PROPERTY_PROCESS_ID, modelNode));
			process.setName(BpmnJsonConverterUtil.getPropertyValueAsString(PROPERTY_NAME, modelNode));
			String namespace = BpmnJsonConverterUtil.getPropertyValueAsString(PROPERTY_PROCESS_NAMESPACE, modelNode);
			if (StringUtils.isNotEmpty(namespace)) {
				bpmnModel.setTargetNamespace(namespace);
			}
			process.setDocumentation(BpmnJsonConverterUtil.getPropertyValueAsString(PROPERTY_DOCUMENTATION, modelNode));

			/**
			 * 新加流程扩展
			 */
			Map<String, List<ExtensionElement>> extensionElements = new HashMap<String, List<ExtensionElement>>();
			
			List<ExtensionElement> extensionElementList = new ArrayList<>();
			ExtensionElement extensionElement = new ExtensionElement();
			extensionElement.setName("activiti:assignernull");
			extensionElement.setElementText(BpmnJsonConverterUtil.getPropertyValueAsString("assignernull", modelNode));
			extensionElementList.add(extensionElement);
			extensionElements.put("assignernull", extensionElementList);
			process.setExtensionElements(extensionElements);

			JsonNode processExecutableNode = JsonConverterUtil.getProperty(PROPERTY_PROCESS_EXECUTABLE, modelNode);
			if (processExecutableNode != null && StringUtils.isNotEmpty(processExecutableNode.asText())) {
				process.setExecutable(
						JsonConverterUtil.getPropertyValueAsBoolean(PROPERTY_PROCESS_EXECUTABLE, modelNode));
			}

			BpmnJsonConverterUtil.convertJsonToMessages(modelNode, bpmnModel);

			BpmnJsonConverterUtil.convertJsonToListeners(modelNode, process);
			JsonNode eventListenersNode = BpmnJsonConverterUtil.getProperty(PROPERTY_EVENT_LISTENERS, modelNode);
			if (eventListenersNode != null) {
				eventListenersNode = BpmnJsonConverterUtil.validateIfNodeIsTextual(eventListenersNode);
				BpmnJsonConverterUtil.parseEventListeners(eventListenersNode.get(PROPERTY_EVENTLISTENER_VALUE),
						process);
			}

			JsonNode processDataPropertiesNode = modelNode.get(EDITOR_SHAPE_PROPERTIES).get(PROPERTY_DATA_PROPERTIES);

			if (processDataPropertiesNode != null) {
				List<ValuedDataObject> dataObjects = BpmnJsonConverterUtil
						.convertJsonToDataProperties(processDataPropertiesNode, process);
				process.setDataObjects(dataObjects);
				process.getFlowElements().addAll(dataObjects);
			}

			processJsonElements(shapesArrayNode, modelNode, process, shapeMap, bpmnModel);

		} else {
			for (JsonNode shapeNode : shapesArrayNode) {
				if (STENCIL_SEQUENCE_FLOW.equalsIgnoreCase(BpmnJsonConverterUtil.getStencilId(shapeNode))
						|| STENCIL_ASSOCIATION.equalsIgnoreCase(BpmnJsonConverterUtil.getStencilId(shapeNode))) {

					String sourceRef = BpmnJsonConverterUtil.lookForSourceRef(shapeNode.get(EDITOR_SHAPE_ID).asText(),
							modelNode.get(EDITOR_CHILD_SHAPES));
					if (sourceRef != null) {
						Lane lane = elementInLaneMap.get(sourceRef);
						SequenceFlowJsonConverter flowConverter = new SequenceFlowJsonConverter();
						if (lane != null) {
							flowConverter.convertToBpmnModel(shapeNode, modelNode, this, lane, shapeMap, bpmnModel);
						} else {
							flowConverter.convertToBpmnModel(shapeNode, modelNode, this,
									bpmnModel.getProcesses().get(0), shapeMap, bpmnModel);
						}
					}
				}
			}
		}

		// sequence flows are now all on root level
		Map<String, SubProcess> subShapesMap = new HashMap<String, SubProcess>();
		for (Process process : bpmnModel.getProcesses()) {
			for (FlowElement flowElement : process.findFlowElementsOfType(SubProcess.class)) {
				SubProcess subProcess = (SubProcess) flowElement;
				fillSubShapes(subShapesMap, subProcess);
			}

			if (subShapesMap.size() > 0) {
				List<String> removeSubFlowsList = new ArrayList<String>();
				for (FlowElement flowElement : process.findFlowElementsOfType(SequenceFlow.class)) {
					SequenceFlow sequenceFlow = (SequenceFlow) flowElement;
					if (subShapesMap.containsKey(sequenceFlow.getSourceRef())) {
						SubProcess subProcess = subShapesMap.get(sequenceFlow.getSourceRef());
						if (subProcess.getFlowElement(sequenceFlow.getId()) == null) {
							subProcess.addFlowElement(sequenceFlow);
							removeSubFlowsList.add(sequenceFlow.getId());
						}
					}
				}
				for (String flowId : removeSubFlowsList) {
					process.removeFlowElement(flowId);
				}
			}
		}

		Map<String, FlowWithContainer> allFlowMap = new HashMap<String, FlowWithContainer>();
		List<Gateway> gatewayWithOrderList = new ArrayList<Gateway>();
		// post handling of process elements
		for (Process process : bpmnModel.getProcesses()) {
			postProcessElements(process, process.getFlowElements(), edgeMap, bpmnModel, allFlowMap,
					gatewayWithOrderList);
		}

		// sort the sequence flows
		for (Gateway gateway : gatewayWithOrderList) {
			List<ExtensionElement> orderList = gateway.getExtensionElements().get("EDITOR_FLOW_ORDER");
			if (CollectionUtils.isNotEmpty(orderList)) {
				for (ExtensionElement orderElement : orderList) {
					String flowValue = orderElement.getElementText();
					if (StringUtils.isNotEmpty(flowValue)) {
						if (allFlowMap.containsKey(flowValue)) {
							FlowWithContainer flowWithContainer = allFlowMap.get(flowValue);
							flowWithContainer.getFlowContainer()
									.removeFlowElement(flowWithContainer.getSequenceFlow().getId());
							flowWithContainer.getFlowContainer().addFlowElement(flowWithContainer.getSequenceFlow());
						}
					}
				}
			}
			gateway.getExtensionElements().remove("EDITOR_FLOW_ORDER");
		}

		return bpmnModel;
	}

	@Override
	public void processJsonElements(JsonNode shapesArrayNode, JsonNode modelNode, BaseElement parentElement,
			Map<String, JsonNode> shapeMap, BpmnModel bpmnModel) {
		// TODO Auto-generated method stub
		super.processJsonElements(shapesArrayNode, modelNode, parentElement, shapeMap, bpmnModel);
	}

	private void filterAllEdges(JsonNode objectNode, Map<String, JsonNode> edgeMap,
			Map<String, List<JsonNode>> sourceAndTargetMap, Map<String, JsonNode> shapeMap,
			Map<String, JsonNode> sourceRefMap) {

		if (objectNode.get(EDITOR_CHILD_SHAPES) != null) {
			for (JsonNode jsonChildNode : objectNode.get(EDITOR_CHILD_SHAPES)) {

				ObjectNode childNode = (ObjectNode) jsonChildNode;
				String stencilId = BpmnJsonConverterUtil.getStencilId(childNode);
				if (STENCIL_SUB_PROCESS.equals(stencilId)) {
					filterAllEdges(childNode, edgeMap, sourceAndTargetMap, shapeMap, sourceRefMap);

				} else if (STENCIL_SEQUENCE_FLOW.equals(stencilId) || STENCIL_ASSOCIATION.equals(stencilId)) {

					String childEdgeId = BpmnJsonConverterUtil.getElementId(childNode);
					JsonNode targetNode = childNode.get("target");
					if (targetNode != null && targetNode.isNull() == false) {
						String targetRefId = targetNode.get(EDITOR_SHAPE_ID).asText();
						List<JsonNode> sourceAndTargetList = new ArrayList<JsonNode>();
						sourceAndTargetList.add(sourceRefMap.get(childNode.get(EDITOR_SHAPE_ID).asText()));
						sourceAndTargetList.add(shapeMap.get(targetRefId));
						sourceAndTargetMap.put(childEdgeId, sourceAndTargetList);
					}
					edgeMap.put(childEdgeId, childNode);
				}
			}
		}
	}

	private void readEdgeDI(Map<String, JsonNode> edgeMap, Map<String, List<JsonNode>> sourceAndTargetMap,
			BpmnModel bpmnModel) {

		for (String edgeId : edgeMap.keySet()) {

			JsonNode edgeNode = edgeMap.get(edgeId);
			List<JsonNode> sourceAndTargetList = sourceAndTargetMap.get(edgeId);

			JsonNode sourceRefNode = null;
			JsonNode targetRefNode = null;

			if (sourceAndTargetList != null && sourceAndTargetList.size() > 1) {
				sourceRefNode = sourceAndTargetList.get(0);
				targetRefNode = sourceAndTargetList.get(1);
			}

			if (sourceRefNode == null) {
				LOGGER.info("Skipping edge {} because source ref is null", edgeId);
				continue;
			}

			if (targetRefNode == null) {
				LOGGER.info("Skipping edge {} because target ref is null", edgeId);
				continue;
			}

			JsonNode dockersNode = edgeNode.get(EDITOR_DOCKERS);
			double sourceDockersX = dockersNode.get(0).get(EDITOR_BOUNDS_X).asDouble();
			double sourceDockersY = dockersNode.get(0).get(EDITOR_BOUNDS_Y).asDouble();

			GraphicInfo sourceInfo = bpmnModel.getGraphicInfo(BpmnJsonConverterUtil.getElementId(sourceRefNode));
			GraphicInfo targetInfo = bpmnModel.getGraphicInfo(BpmnJsonConverterUtil.getElementId(targetRefNode));

			double sourceRefLineX = sourceInfo.getX() + sourceDockersX;
			double sourceRefLineY = sourceInfo.getY() + sourceDockersY;

			double nextPointInLineX;
			double nextPointInLineY;

			nextPointInLineX = dockersNode.get(1).get(EDITOR_BOUNDS_X).asDouble();
			nextPointInLineY = dockersNode.get(1).get(EDITOR_BOUNDS_Y).asDouble();
			if (dockersNode.size() == 2) {
				nextPointInLineX += targetInfo.getX();
				nextPointInLineY += targetInfo.getY();
			}

			Line2D firstLine = new Line2D(sourceRefLineX, sourceRefLineY, nextPointInLineX, nextPointInLineY);

			String sourceRefStencilId = BpmnJsonConverterUtil.getStencilId(sourceRefNode);
			String targetRefStencilId = BpmnJsonConverterUtil.getStencilId(targetRefNode);

			List<GraphicInfo> graphicInfoList = new ArrayList<GraphicInfo>();

			AbstractContinuousCurve2D source2D = null;
			if (DI_CIRCLES.contains(sourceRefStencilId)) {
				source2D = new Circle2D(sourceInfo.getX() + sourceDockersX, sourceInfo.getY() + sourceDockersY,
						sourceDockersX);

			} else if (DI_RECTANGLES.contains(sourceRefStencilId)) {
				source2D = createRectangle(sourceInfo);

			} else if (DI_GATEWAY.contains(sourceRefStencilId)) {
				source2D = createGateway(sourceInfo);
			}

			if (source2D != null) {
				Collection<Point2D> intersections = source2D.intersections(firstLine);
				if (intersections != null && intersections.size() > 0) {
					Point2D intersection = intersections.iterator().next();
					graphicInfoList.add(createGraphicInfo(intersection.x(), intersection.y()));
				} else {
					graphicInfoList.add(createGraphicInfo(sourceRefLineX, sourceRefLineY));
				}
			}

			Line2D lastLine = null;

			if (dockersNode.size() > 2) {
				for (int i = 1; i < dockersNode.size() - 1; i++) {
					double x = dockersNode.get(i).get(EDITOR_BOUNDS_X).asDouble();
					double y = dockersNode.get(i).get(EDITOR_BOUNDS_Y).asDouble();
					graphicInfoList.add(createGraphicInfo(x, y));
				}

				double startLastLineX = dockersNode.get(dockersNode.size() - 2).get(EDITOR_BOUNDS_X).asDouble();
				double startLastLineY = dockersNode.get(dockersNode.size() - 2).get(EDITOR_BOUNDS_Y).asDouble();

				double endLastLineX = dockersNode.get(dockersNode.size() - 1).get(EDITOR_BOUNDS_X).asDouble();
				double endLastLineY = dockersNode.get(dockersNode.size() - 1).get(EDITOR_BOUNDS_Y).asDouble();

				endLastLineX += targetInfo.getX();
				endLastLineY += targetInfo.getY();

				lastLine = new Line2D(startLastLineX, startLastLineY, endLastLineX, endLastLineY);

			} else {
				lastLine = firstLine;
			}

			AbstractContinuousCurve2D target2D = null;
			if (DI_RECTANGLES.contains(targetRefStencilId)) {
				target2D = createRectangle(targetInfo);

			} else if (DI_CIRCLES.contains(targetRefStencilId)) {

				double targetDockersX = dockersNode.get(dockersNode.size() - 1).get(EDITOR_BOUNDS_X).asDouble();
				double targetDockersY = dockersNode.get(dockersNode.size() - 1).get(EDITOR_BOUNDS_Y).asDouble();

				target2D = new Circle2D(targetInfo.getX() + targetDockersX, targetInfo.getY() + targetDockersY,
						targetDockersX);

			} else if (DI_GATEWAY.contains(targetRefStencilId)) {
				target2D = createGateway(targetInfo);
			}

			if (target2D != null) {
				Collection<Point2D> intersections = target2D.intersections(lastLine);
				if (intersections != null && intersections.size() > 0) {
					Point2D intersection = intersections.iterator().next();
					graphicInfoList.add(createGraphicInfo(intersection.x(), intersection.y()));
				} else {
					graphicInfoList.add(createGraphicInfo(lastLine.getPoint2().x(), lastLine.getPoint2().y()));
				}
			}

			bpmnModel.addFlowGraphicInfoList(edgeId, graphicInfoList);
		}
	}

	private Polyline2D createRectangle(GraphicInfo graphicInfo) {
		Polyline2D rectangle = new Polyline2D(new Point2D(graphicInfo.getX(), graphicInfo.getY()),
				new Point2D(graphicInfo.getX() + graphicInfo.getWidth(), graphicInfo.getY()),
				new Point2D(graphicInfo.getX() + graphicInfo.getWidth(), graphicInfo.getY() + graphicInfo.getHeight()),
				new Point2D(graphicInfo.getX(), graphicInfo.getY() + graphicInfo.getHeight()),
				new Point2D(graphicInfo.getX(), graphicInfo.getY()));
		return rectangle;
	}

	private Polyline2D createGateway(GraphicInfo graphicInfo) {

		double middleX = graphicInfo.getX() + (graphicInfo.getWidth() / 2);
		double middleY = graphicInfo.getY() + (graphicInfo.getHeight() / 2);

		Polyline2D gatewayRectangle = new Polyline2D(new Point2D(graphicInfo.getX(), middleY),
				new Point2D(middleX, graphicInfo.getY()),
				new Point2D(graphicInfo.getX() + graphicInfo.getWidth(), middleY),
				new Point2D(middleX, graphicInfo.getY() + graphicInfo.getHeight()),
				new Point2D(graphicInfo.getX(), middleY));

		return gatewayRectangle;
	}

	private GraphicInfo createGraphicInfo(double x, double y) {
		GraphicInfo graphicInfo = new GraphicInfo();
		graphicInfo.setX(x);
		graphicInfo.setY(y);
		return graphicInfo;
	}

	private void postProcessElements(FlowElementsContainer parentContainer, Collection<FlowElement> flowElementList,
			Map<String, JsonNode> edgeMap, BpmnModel bpmnModel, Map<String, FlowWithContainer> allFlowMap,
			List<Gateway> gatewayWithOrderList) {

		for (FlowElement flowElement : flowElementList) {

			if (flowElement instanceof Event) {
				Event event = (Event) flowElement;
				if (CollectionUtils.isNotEmpty(event.getEventDefinitions())) {
					EventDefinition eventDef = event.getEventDefinitions().get(0);
					if (eventDef instanceof SignalEventDefinition) {
						SignalEventDefinition signalEventDef = (SignalEventDefinition) eventDef;
						if (StringUtils.isNotEmpty(signalEventDef.getSignalRef())) {
							if (bpmnModel.getSignal(signalEventDef.getSignalRef()) == null) {
								bpmnModel.addSignal(
										new Signal(signalEventDef.getSignalRef(), signalEventDef.getSignalRef()));
							}
						}

					} else if (eventDef instanceof MessageEventDefinition) {
						MessageEventDefinition messageEventDef = (MessageEventDefinition) eventDef;
						if (StringUtils.isNotEmpty(messageEventDef.getMessageRef())) {
							if (bpmnModel.getMessage(messageEventDef.getMessageRef()) == null) {
								bpmnModel.addMessage(new Message(messageEventDef.getMessageRef(),
										messageEventDef.getMessageRef(), null));
							}
						}
					}
				}
			}

			if (flowElement instanceof BoundaryEvent) {
				BoundaryEvent boundaryEvent = (BoundaryEvent) flowElement;
				Activity activity = retrieveAttachedRefObject(boundaryEvent.getAttachedToRefId(),
						parentContainer.getFlowElements());

				if (activity == null) {
					LOGGER.warn("Boundary event " + boundaryEvent.getId() + " is not attached to any activity");
				} else {
					boundaryEvent.setAttachedToRef(activity);
					activity.getBoundaryEvents().add(boundaryEvent);
				}

			} else if (flowElement instanceof Gateway) {
				if (flowElement.getExtensionElements().containsKey("EDITOR_FLOW_ORDER")) {
					gatewayWithOrderList.add((Gateway) flowElement);
				}

			} else if (flowElement instanceof SubProcess) {
				SubProcess subProcess = (SubProcess) flowElement;
				postProcessElements(subProcess, subProcess.getFlowElements(), edgeMap, bpmnModel, allFlowMap,
						gatewayWithOrderList);

			} else if (flowElement instanceof SequenceFlow) {
				SequenceFlow sequenceFlow = (SequenceFlow) flowElement;
				FlowElement sourceFlowElement = parentContainer.getFlowElement(sequenceFlow.getSourceRef());
				if (sourceFlowElement != null && sourceFlowElement instanceof FlowNode) {

					FlowWithContainer flowWithContainer = new FlowWithContainer(sequenceFlow, parentContainer);
					if (sequenceFlow.getExtensionElements().get("EDITOR_RESOURCEID") != null
							&& sequenceFlow.getExtensionElements().get("EDITOR_RESOURCEID").size() > 0) {
						allFlowMap.put(
								sequenceFlow.getExtensionElements().get("EDITOR_RESOURCEID").get(0).getElementText(),
								flowWithContainer);
						sequenceFlow.getExtensionElements().remove("EDITOR_RESOURCEID");
					}

					((FlowNode) sourceFlowElement).getOutgoingFlows().add(sequenceFlow);
					JsonNode edgeNode = edgeMap.get(sequenceFlow.getId());
					if (edgeNode != null) {
						boolean isDefault = JsonConverterUtil.getPropertyValueAsBoolean(PROPERTY_SEQUENCEFLOW_DEFAULT,
								edgeNode);
						if (isDefault) {
							if (sourceFlowElement instanceof Activity) {
								((Activity) sourceFlowElement).setDefaultFlow(sequenceFlow.getId());
							} else if (sourceFlowElement instanceof Gateway) {
								((Gateway) sourceFlowElement).setDefaultFlow(sequenceFlow.getId());
							}
						}
					}
				}
				FlowElement targetFlowElement = parentContainer.getFlowElement(sequenceFlow.getTargetRef());
				if (targetFlowElement != null && targetFlowElement instanceof FlowNode) {
					((FlowNode) targetFlowElement).getIncomingFlows().add(sequenceFlow);
				}
			}
		}
	}

	private Activity retrieveAttachedRefObject(String attachedToRefId, Collection<FlowElement> flowElementList) {
		Activity activity = null;
		if (StringUtils.isNotEmpty(attachedToRefId)) {
			for (FlowElement flowElement : flowElementList) {
				if (attachedToRefId.equals(flowElement.getId())) {
					activity = (Activity) flowElement;
					break;

				} else if (flowElement instanceof SubProcess) {
					SubProcess subProcess = (SubProcess) flowElement;
					Activity retrievedActivity = retrieveAttachedRefObject(attachedToRefId,
							subProcess.getFlowElements());
					if (retrievedActivity != null) {
						activity = retrievedActivity;
						break;
					}
				}
			}
		}
		return activity;
	}

	private void readShapeDI(JsonNode objectNode, double parentX, double parentY, Map<String, JsonNode> shapeMap,
			Map<String, JsonNode> sourceRefMap, BpmnModel bpmnModel) {

		if (objectNode.get(EDITOR_CHILD_SHAPES) != null) {
			for (JsonNode jsonChildNode : objectNode.get(EDITOR_CHILD_SHAPES)) {

				String stencilId = BpmnJsonConverterUtil.getStencilId(jsonChildNode);
				if (STENCIL_SEQUENCE_FLOW.equals(stencilId) == false) {

					GraphicInfo graphicInfo = new GraphicInfo();

					JsonNode boundsNode = jsonChildNode.get(EDITOR_BOUNDS);
					ObjectNode upperLeftNode = (ObjectNode) boundsNode.get(EDITOR_BOUNDS_UPPER_LEFT);
					graphicInfo.setX(upperLeftNode.get(EDITOR_BOUNDS_X).asDouble() + parentX);
					graphicInfo.setY(upperLeftNode.get(EDITOR_BOUNDS_Y).asDouble() + parentY);

					ObjectNode lowerRightNode = (ObjectNode) boundsNode.get(EDITOR_BOUNDS_LOWER_RIGHT);
					graphicInfo.setWidth(lowerRightNode.get(EDITOR_BOUNDS_X).asDouble() - graphicInfo.getX() + parentX);
					graphicInfo
							.setHeight(lowerRightNode.get(EDITOR_BOUNDS_Y).asDouble() - graphicInfo.getY() + parentY);

					String childShapeId = jsonChildNode.get(EDITOR_SHAPE_ID).asText();
					bpmnModel.addGraphicInfo(BpmnJsonConverterUtil.getElementId(jsonChildNode), graphicInfo);

					shapeMap.put(childShapeId, jsonChildNode);

					ArrayNode outgoingNode = (ArrayNode) jsonChildNode.get("outgoing");
					if (outgoingNode != null && outgoingNode.size() > 0) {
						for (JsonNode outgoingChildNode : outgoingNode) {
							JsonNode resourceNode = outgoingChildNode.get(EDITOR_SHAPE_ID);
							if (resourceNode != null) {
								sourceRefMap.put(resourceNode.asText(), jsonChildNode);
							}
						}
					}

					readShapeDI(jsonChildNode, graphicInfo.getX(), graphicInfo.getY(), shapeMap, sourceRefMap,
							bpmnModel);
				}
			}
		}
	}

	private void fillSubShapes(Map<String, SubProcess> subShapesMap, SubProcess subProcess) {
		for (FlowElement flowElement : subProcess.getFlowElements()) {
			if (flowElement instanceof SubProcess) {
				SubProcess childSubProcess = (SubProcess) flowElement;
				subShapesMap.put(childSubProcess.getId(), subProcess);
				fillSubShapes(subShapesMap, childSubProcess);
			} else {
				subShapesMap.put(flowElement.getId(), subProcess);
			}
		}
	}

	class FlowWithContainer {
		protected SequenceFlow sequenceFlow;
		protected FlowElementsContainer flowContainer;

		public FlowWithContainer(SequenceFlow sequenceFlow, FlowElementsContainer flowContainer) {
			this.sequenceFlow = sequenceFlow;
			this.flowContainer = flowContainer;
		}

		public SequenceFlow getSequenceFlow() {
			return sequenceFlow;
		}

		public void setSequenceFlow(SequenceFlow sequenceFlow) {
			this.sequenceFlow = sequenceFlow;
		}

		public FlowElementsContainer getFlowContainer() {
			return flowContainer;
		}

		public void setFlowContainer(FlowElementsContainer flowContainer) {
			this.flowContainer = flowContainer;
		}
	}

}