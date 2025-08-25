# En un archivo, por ejemplo, API/middleware.py
class JWTAuthCookieMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        print("cookies")
        print(request.COOKIES)
        token = request.COOKIES.get('access_token')
        if token and not request.META.get('HTTP_AUTHORIZATION'):
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {token}'
        return self.get_response(request)