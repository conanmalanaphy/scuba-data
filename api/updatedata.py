from http.server import BaseHTTPRequestHandler
from datetime import datetime
import math
import re
from collections import Counter

WORD = re.compile(r"\w+")


def get_cosine(vec1, vec2):
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum([vec1[x] * vec2[x] for x in intersection])

    sum1 = sum([vec1[x] ** 2 for x in list(vec1.keys())])
    sum2 = sum([vec2[x] ** 2 for x in list(vec2.keys())])
    denominator = math.sqrt(sum1) * math.sqrt(sum2)

    if not denominator:
        return 0.0
    else:
        return float(numerator) / denominator


def text_to_vector(text):
    words = WORD.findall(text)
    return Counter(words)

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        text1 = "This is a foo bar sentence ."
        text2 = "This sentence is similar to a foo bar sentence ."

        vector1 = text_to_vector(text1)
        vector2 = text_to_vector(text2)

        cosine = get_cosine(vector1, vector2)

        print("Cosine:", cosine)
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(cosine)
        return

    def do_POST(self):
        text1 = "This is a foo bar sentence ."
        text2 = "This sentence is similar to a foo bar sentence ."

        vector1 = text_to_vector(text1)
        vector2 = text_to_vector(text2)

        cosine = get_cosine(vector1, vector2)

        content_len = int(self.headers.get('Content-Length'))
        post_body = self.rfile.read(content_len)

        print(post_body)
        print("Cosine:", cosine)
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(str(cosine).encode())
        return