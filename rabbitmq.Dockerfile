ARG PLUGIN_VERSION=3.11.1
ARG BASE_VERSION=3

FROM alpine as builder 

ARG PLUGIN_VERSION

RUN apk --no-cache add curl

RUN mkdir -p /plugins \
    && curl -fsSL \
	-o "/plugins/rabbitmq_delayed_message_exchange-${PLUGIN_VERSION}.ez" \
	https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/${PLUGIN_VERSION}/rabbitmq_delayed_message_exchange-${PLUGIN_VERSION}.ez

FROM rabbitmq:${BASE_VERSION}-management

ARG PLUGIN_VERSION

COPY --from=builder --chown=rabbitmq:rabbitmq \
    /plugins/rabbitmq_delayed_message_exchange-${PLUGIN_VERSION}.ez \
    $RABBITMQ_HOME/plugins/rabbitmq_delayed_message_exchange-${PLUGIN_VERSION}.ez

RUN rabbitmq-plugins enable rabbitmq_delayed_message_exchange
