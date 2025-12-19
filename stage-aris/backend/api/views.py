from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from bson import ObjectId

from api.db import get_db
from api.serializers import CourseSerializer


@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello World!'})

@api_view(['GET', 'POST'])
def course_list(request):
    if request.method == 'GET':
        courses = list(get_db().courses.find())
        for course in courses:
            course['_id'] = str(course['_id'])
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def course_detail(request, pk):
    try:
        course = get_db().courses.find_one({'_id': ObjectId(pk)})
        if not course:
            return Response(status=status.HTTP_404_NOT_FOUND)
        course['_id'] = str(course['_id'])
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CourseSerializer(course)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        get_db().courses.delete_one({'_id': ObjectId(pk)})
        return Response(status=status.HTTP_204_NO_CONTENT)
