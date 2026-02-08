ARG BUILD_FROM
FROM $BUILD_FROM

# Install requirements
RUN apk add --no-cache \
    python3 \
    py3-pip \
    py3-flask \
    py3-requests \
    nginx

# Copy data
COPY rootfs /

# Install Python dependencies
RUN pip3 install --no-cache-dir \
    flask-cors \
    python-dateutil \
    icalendar

# Make run script executable
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
