from django.urls import path
from api.views import hello_world, course_list, course_detail

urlpatterns = [
    path('api/hello/', hello_world, name='hello-world'),
    path('api/courses/', course_list, name='course-list'),
    path('api/courses/<str:pk>/', course_detail, name='course-detail'),
]
