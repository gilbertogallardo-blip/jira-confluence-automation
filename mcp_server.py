#!/usr/bin/env python3
import datetime
import json
import sys

TOOLS = [
    {
        "name": "echo",
        "description": "Return the text provided to the tool.",
        "inputSchema": {
            "type": "object",
            "properties": {"text": {"type": "string", "description": "Text to echo back."}},
            "required": ["text"],
        },
    },
    {
        "name": "get_time",
        "description": "Return the current UTC timestamp in ISO 8601 format.",
        "inputSchema": {"type": "object", "properties": {}},
    },
    {
        "name": "calculate",
        "description": "Perform a simple arithmetic calculation.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "a": {"type": "number", "description": "Left operand."},
                "b": {"type": "number", "description": "Right operand."},
                "operation": {"type": "string", "description": "Operation to apply: add, subtract, multiply, divide."}
            },
            "required": ["a", "b", "operation"],
        },
    },
]


def jsonrpc_response(request_id, result=None, error=None):
    payload = {"jsonrpc": "2.0", "id": request_id}
    if error is not None:
        payload["error"] = error
    else:
        payload["result"] = result
    return payload


def tool_call(name, arguments):
    if name == "echo":
        text = arguments.get("text", "")
        return {
            "content": [{"type": "text", "text": text}],
            "structuredContent": {"result": text},
        }

    if name == "get_time":
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
        return {
            "content": [{"type": "text", "text": timestamp}],
            "structuredContent": {"timestamp": timestamp},
        }

    if name == "calculate":
        a = float(arguments["a"])
        b = float(arguments["b"])
        operation = arguments.get("operation", "add")
        if operation == "add":
            result = a + b
        elif operation == "subtract":
            result = a - b
        elif operation == "multiply":
            result = a * b
        elif operation == "divide":
            if b == 0:
                raise ValueError("Division by zero is not allowed.")
            result = a / b
        else:
            raise ValueError(f"Unsupported operation: {operation}")
        return {
            "content": [{"type": "text", "text": str(result)}],
            "structuredContent": {"result": result},
        }

    raise ValueError(f"Unknown tool: {name}")


def handle_message(message):
    method = message.get("method")
    request_id = message.get("id")

    if method == "initialize":
        return jsonrpc_response(
            request_id,
            result={
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "hello-genai-tools", "version": "1.0.0"},
            },
        )

    if method == "tools/list":
        return jsonrpc_response(request_id, result={"tools": TOOLS})

    if method == "tools/call":
        params = message.get("params") or {}
        tool_name = params.get("name")
        tool_args = params.get("arguments") or {}
        try:
            result = tool_call(tool_name, tool_args)
            return jsonrpc_response(request_id, result=result)
        except Exception as exc:
            return jsonrpc_response(
                request_id,
                error={"code": -32602, "message": str(exc)},
            )

    if method in {"notifications/initialized", "ping"}:
        return None

    return jsonrpc_response(
        request_id,
        error={"code": -32601, "message": f"Method not found: {method}"},
    )


def main():
    while True:
        line = sys.stdin.readline()
        if not line:
            break
        if not line.strip():
            continue

        try:
            message = json.loads(line)
        except json.JSONDecodeError:
            continue

        response = handle_message(message)
        if response is not None:
            print(json.dumps(response), flush=True)


if __name__ == "__main__":
    main()
