wsgi_app = 'backend:app'

accesslog = 'access.log'
errorlog = 'error.log'

bind = "unix:/tmp/gunicorn.sock"
limit_request_line = 8192
