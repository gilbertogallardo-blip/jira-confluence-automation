import json
import unittest

import mcp_server


class McpServerEchoToolTests(unittest.TestCase):
    def test_echo_is_listed_in_tools(self):
        response = mcp_server.handle_message({"method": "tools/list", "id": 1})
        tools = response["result"]["tools"]
        self.assertIn("echo", {tool["name"] for tool in tools})

    def test_echo_tool_executes(self):
        response = mcp_server.handle_message({
            "method": "tools/call",
            "id": 2,
            "params": {"name": "echo", "arguments": {"text": "hello"}},
        })
        self.assertEqual(response["result"]["structuredContent"]["result"], "hello")


if __name__ == "__main__":
    unittest.main()
